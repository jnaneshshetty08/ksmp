#!/usr/bin/env node

const { SNSClient, SubscribeCommand, ListSubscriptionsByTopicCommand } = require('@aws-sdk/client-sns');
require('dotenv').config();

async function setupEmailNotifications() {
  console.log('📧 Setting up Email Notifications for Kalpla...\n');

  const snsClient = new SNSClient({
    region: process.env.AWS_REGION || 'us-east-1',
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });

  try {
    const emailTopicArn = process.env.AWS_SNS_EMAIL_TOPIC_ARN;
    
    if (!emailTopicArn) {
      console.error('❌ AWS_SNS_EMAIL_TOPIC_ARN not found in environment variables');
      process.exit(1);
    }

    console.log(`📧 Using email topic: ${emailTopicArn}`);

    // List existing subscriptions
    console.log('📋 Checking existing email subscriptions...');
    const listCommand = new ListSubscriptionsByTopicCommand({
      TopicArn: emailTopicArn,
    });
    
    const listResponse = await snsClient.send(listCommand);
    const existingSubscriptions = listResponse.Subscriptions || [];
    
    console.log(`Found ${existingSubscriptions.length} existing subscriptions`);

    // Sample email addresses to subscribe (you can modify these)
    const sampleEmails = [
      'admin@kalpla.in',
      'support@kalpla.in',
      'notifications@kalpla.in'
    ];

    console.log('\n📧 Setting up email subscriptions...');
    
    for (const email of sampleEmails) {
      // Check if email is already subscribed
      const existingSubscription = existingSubscriptions.find(sub => 
        sub.Endpoint === email && sub.Protocol === 'email'
      );

      if (existingSubscription) {
        console.log(`✅ Email '${email}' already subscribed: ${existingSubscription.SubscriptionArn}`);
      } else {
        try {
          const subscribeCommand = new SubscribeCommand({
            TopicArn: emailTopicArn,
            Protocol: 'email',
            Endpoint: email,
          });

          const response = await snsClient.send(subscribeCommand);
          console.log(`✅ Subscribed '${email}': ${response.SubscriptionArn}`);
          console.log(`   📧 Check email for confirmation link!`);
        } catch (error) {
          console.error(`❌ Failed to subscribe '${email}':`, error.message);
        }
      }
    }

    console.log('\n🎉 Email notification setup completed!');
    console.log('\n📝 Next steps:');
    console.log('1. Check email inboxes for SNS confirmation links');
    console.log('2. Click confirmation links to activate subscriptions');
    console.log('3. Test email notifications using the API');
    console.log('\n💡 Test email notification:');
    console.log('curl -X POST http://localhost:3001/api/notifications/test-email \\');
    console.log('  -H "Content-Type: application/json" \\');
    console.log('  -d \'{"email":"your-email@example.com","subject":"Test","message":"Hello from Kalpla!"}\'');

  } catch (error) {
    console.error('❌ Error setting up email notifications:', error);
    process.exit(1);
  }
}

// Run the setup
setupEmailNotifications();
