import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, PutCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import * as admin from 'firebase-admin';

const dynamoClient = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(dynamoClient);

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    }),
  });
}

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  console.log('Event:', JSON.stringify(event, null, 2));

  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
  };

  try {
    const { httpMethod, path, body } = event;

    // Handle CORS preflight
    if (httpMethod === 'OPTIONS') {
      return {
        statusCode: 200,
        headers,
        body: '',
      };
    }

    // Route handling
    if (path === '/notifications/fcm-token' && httpMethod === 'POST') {
      return await handleUpdateFCMToken(body, headers);
    }

    if (path === '/notifications/fcm-token' && httpMethod === 'DELETE') {
      return await handleRemoveFCMToken(event.pathParameters?.userId, headers);
    }

    if (path === '/notifications/send' && httpMethod === 'POST') {
      return await handleSendNotification(body, headers);
    }

    if (path === '/notifications/send-multiple' && httpMethod === 'POST') {
      return await handleSendMultipleNotifications(body, headers);
    }

    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ error: 'Not found' }),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};

async function handleUpdateFCMToken(body: string | null, headers: any): Promise<APIGatewayProxyResult> {
  try {
    const { userId, fcmToken } = JSON.parse(body || '{}');

    if (!userId || !fcmToken) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ success: false, error: 'Missing userId or fcmToken' }),
      };
    }

    // Update user's FCM token in DynamoDB
    await docClient.send(new UpdateCommand({
      TableName: 'User',
      Key: { id: userId },
      UpdateExpression: 'SET fcmToken = :token',
      ExpressionAttributeValues: {
        ':token': fcmToken,
      },
    }));

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true }),
    };
  } catch (error) {
    console.error('Error updating FCM token:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, error: 'Failed to update FCM token' }),
    };
  }
}

async function handleRemoveFCMToken(userId: string | undefined, headers: any): Promise<APIGatewayProxyResult> {
  try {
    if (!userId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ success: false, error: 'Missing userId' }),
      };
    }

    // Remove user's FCM token from DynamoDB
    await docClient.send(new UpdateCommand({
      TableName: 'User',
      Key: { id: userId },
      UpdateExpression: 'REMOVE fcmToken',
    }));

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true }),
    };
  } catch (error) {
    console.error('Error removing FCM token:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, error: 'Failed to remove FCM token' }),
    };
  }
}

async function handleSendNotification(body: string | null, headers: any): Promise<APIGatewayProxyResult> {
  try {
    const { userId, title, body: messageBody, data } = JSON.parse(body || '{}');

    if (!userId || !title || !messageBody) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ success: false, error: 'Missing required fields' }),
      };
    }

    // Get user's FCM token
    const user = await docClient.send(new GetCommand({
      TableName: 'User',
      Key: { id: userId },
    }));

    if (!user.Item?.fcmToken) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ success: false, error: 'No FCM token found for user' }),
      };
    }

    // Send notification via Firebase
    const message = {
      token: user.Item.fcmToken,
      notification: {
        title,
        body: messageBody,
      },
      data: data || {},
    };

    const response = await admin.messaging().send(message);
    console.log('Successfully sent message:', response);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, messageId: response }),
    };
  } catch (error) {
    console.error('Error sending notification:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, error: 'Failed to send notification' }),
    };
  }
}

async function handleSendMultipleNotifications(body: string | null, headers: any): Promise<APIGatewayProxyResult> {
  try {
    const { userIds, title, body: messageBody, data } = JSON.parse(body || '{}');

    if (!userIds || !Array.isArray(userIds) || !title || !messageBody) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ success: false, error: 'Missing required fields' }),
      };
    }

    // Get users' FCM tokens
    const tokens: string[] = [];
    for (const userId of userIds) {
      const user = await docClient.send(new GetCommand({
        TableName: 'User',
        Key: { id: userId },
      }));
      if (user.Item?.fcmToken) {
        tokens.push(user.Item.fcmToken);
      }
    }

    if (tokens.length === 0) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ success: false, error: 'No FCM tokens found' }),
      };
    }

    // Send notifications via Firebase
    const message = {
      tokens,
      notification: {
        title,
        body: messageBody,
      },
      data: data || {},
    };

    const response = await admin.messaging().sendEachForMulticast(message);
    console.log('Successfully sent messages:', response);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        success: true, 
        successCount: response.successCount,
        failureCount: response.failureCount,
      }),
    };
  } catch (error) {
    console.error('Error sending multiple notifications:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, error: 'Failed to send notifications' }),
    };
  }
}
