import { defineFunction } from '@aws-amplify/backend';

export const notificationFunction = defineFunction({
  name: 'notification-handler',
  entry: './notification-handler.ts',
  environment: {
    FIREBASE_PROJECT_ID: 'kalpla-11a78',
    FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY || '',
    FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL || '',
  },
});
