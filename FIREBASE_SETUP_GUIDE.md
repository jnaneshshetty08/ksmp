# Firebase Setup Guide for Kalpla Push Notifications

## Overview
Firebase is used for push notifications, user authentication, and real-time features in the Kalpla application.

## Required Firebase Services

### 1. Firebase Cloud Messaging (FCM)
- **Purpose**: Push notifications for mobile and web
- **Features**: 
  - Send notifications to specific users
  - Topic-based notifications
  - Rich notifications with images and actions

### 2. Firebase Authentication (Optional)
- **Purpose**: User authentication and management
- **Features**: Email/password, Google, social logins

### 3. Firebase Realtime Database (Optional)
- **Purpose**: Real-time data synchronization
- **Features**: Live updates for chat, notifications

## Step-by-Step Setup

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name: `kalpla-app`
4. Enable Google Analytics (optional)
5. Choose Analytics account (optional)
6. Click "Create project"

### 2. Add Web App to Firebase Project

1. In Firebase Console, click "Add app" → Web (</>) icon
2. Register app name: `kalpla-web`
3. Copy the Firebase configuration object
4. Click "Continue to console"

### 3. Generate Service Account Key

1. Go to Project Settings → Service Accounts
2. Click "Generate new private key"
3. Download the JSON file
4. **Keep this file secure - never commit to version control**

### 4. Configure Firebase Admin SDK

The service account key should be configured in your backend environment:

```bash
# In your .env file
FIREBASE_PROJECT_ID=kalpla-app-12345
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@kalpla-app-12345.iam.gserviceaccount.com
FIREBASE_DATABASE_URL=https://kalpla-app-12345-default-rtdb.firebaseio.com
```

### 5. Configure Frontend Firebase

Add Firebase configuration to your frontend:

```bash
# In your .env.local file
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=kalpla-app-12345.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=kalpla-app-12345
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=kalpla-app-12345.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef123456
```

## Firebase Configuration Files

### Backend Configuration (Firebase Admin SDK)

Create `src/lib/firebase-admin.ts`:

```typescript
import admin from 'firebase-admin';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    }),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
  });
}

export default admin;
```

### Frontend Configuration (Firebase Client SDK)

Create `src/lib/firebase.ts`:

```typescript
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);

export default app;
```

## Push Notification Implementation

### 1. Request Notification Permission

```typescript
// In your frontend component
import { getToken } from 'firebase/messaging';
import { messaging } from '@/lib/firebase';

async function requestNotificationPermission() {
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const token = await getToken(messaging, {
        vapidKey: 'YOUR_VAPID_KEY'
      });
      console.log('FCM Token:', token);
      // Send token to your backend
      await fetch('/api/notifications/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      });
    }
  } catch (error) {
    console.error('Error getting FCM token:', error);
  }
}
```

### 2. Send Push Notifications (Backend)

```typescript
// In your backend service
import admin from '@/lib/firebase-admin';

export async function sendPushNotification(
  token: string,
  title: string,
  body: string,
  data?: any
) {
  try {
    const message = {
      token,
      notification: {
        title,
        body,
      },
      data: data || {},
    };

    const response = await admin.messaging().send(message);
    console.log('Successfully sent message:', response);
    return response;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
}
```

## Testing Firebase Integration

### 1. Test Firebase Admin SDK

```bash
cd kalpla-backend
npm run test:firebase
```

### 2. Test Push Notifications

1. Open your web app
2. Allow notification permissions
3. Check browser console for FCM token
4. Send a test notification from Firebase Console

## Security Best Practices

1. **Never expose Firebase Admin SDK credentials** in frontend code
2. **Use environment variables** for all Firebase configuration
3. **Implement proper authentication** before sending notifications
4. **Validate notification tokens** on the backend
5. **Set up Firebase Security Rules** for database access

## Troubleshooting

### Common Issues:

1. **"Firebase App named '[DEFAULT]' already exists"**
   - Solution: Check if Firebase is already initialized

2. **"Messaging: This browser doesn't support the API"**
   - Solution: Ensure HTTPS in production, localhost works for development

3. **"Invalid registration token"**
   - Solution: Token may be expired, request a new one

4. **"Permission denied"**
   - Solution: Check Firebase Security Rules and IAM permissions

### Debug Commands:

```bash
# Test Firebase Admin SDK
node -e "
const admin = require('firebase-admin');
console.log('Firebase Admin SDK loaded successfully');
"

# Check environment variables
echo $FIREBASE_PROJECT_ID
echo $FIREBASE_CLIENT_EMAIL
```

## Production Deployment

### 1. Environment Variables
Ensure all Firebase environment variables are set in production:

```bash
# Backend (.env)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxx@your-project.iam.gserviceaccount.com
FIREBASE_DATABASE_URL=https://your-project-default-rtdb.firebaseio.com

# Frontend (.env.local)
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

### 2. VAPID Key Setup
For web push notifications, you need a VAPID key:

1. Go to Firebase Console → Project Settings → Cloud Messaging
2. Generate a new key pair
3. Add the public key to your frontend configuration

## Cost Optimization

1. **Monitor Firebase usage** in the console
2. **Set up billing alerts** to avoid unexpected charges
3. **Use topic-based notifications** to reduce individual sends
4. **Implement notification batching** for multiple users
5. **Clean up unused tokens** regularly

## Next Steps

1. ✅ Create Firebase project
2. ✅ Configure service account
3. ✅ Set up environment variables
4. ✅ Test push notifications
5. ✅ Deploy to production
6. ✅ Monitor usage and costs

