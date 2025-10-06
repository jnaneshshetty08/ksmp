# 📱 Kalpla AWS SNS Notification System

## 🚀 **Overview**

The Kalpla notification system uses AWS SNS (Simple Notification Service) to deliver push notifications, emails, and SMS messages to users. This system replaces Firebase and provides a more scalable, cost-effective solution.

## 🔧 **Features**

### ✅ **Implemented Features**
- **Push Notifications**: Mobile app notifications via SNS
- **Email Notifications**: Automated emails for important events
- **SMS Notifications**: Text message alerts (when configured)
- **User Preferences**: Granular notification control
- **Testing Endpoints**: Easy testing and debugging
- **Multiple Channels**: Support for different notification types

### 📋 **Notification Types**
- Session Reminders
- Assignment Deadlines
- Payment Confirmations
- New Messages
- System Updates
- Marketing Emails (optional)

## 🛠 **API Endpoints**

### **Core Notification Endpoints**

#### Send Push Notification
```bash
POST /api/notifications/send
Content-Type: application/json

{
  "userId": "user123",
  "title": "Session Reminder",
  "body": "Your session starts in 15 minutes",
  "data": {
    "sessionId": "session456",
    "type": "session_reminder"
  }
}
```

#### Send to Multiple Users
```bash
POST /api/notifications/send-multiple
Content-Type: application/json

{
  "userIds": ["user1", "user2", "user3"],
  "title": "System Update",
  "body": "New features are now available!",
  "data": {
    "type": "system_update"
  }
}
```

### **Device Token Management**

#### Register Device Token
```bash
POST /api/notifications/device-token
Content-Type: application/json

{
  "userId": "user123",
  "deviceToken": "arn:aws:sns:us-east-1:123456789012:endpoint/GCM/my-app/12345678-1234-1234-1234-123456789012"
}
```

#### Remove Device Token
```bash
DELETE /api/notifications/device-token/user123
```

### **Email Notifications**

#### Send Test Email
```bash
POST /api/notifications/test-email
Content-Type: application/json

{
  "email": "user@example.com",
  "subject": "Welcome to Kalpla!",
  "message": "Thank you for joining our mentorship program."
}
```

### **SMS Notifications**

#### Send Test SMS
```bash
POST /api/notifications/test-sms
Content-Type: application/json

{
  "phoneNumber": "+1234567890",
  "message": "Your session starts in 15 minutes!"
}
```

### **User Preferences**

#### Get User Preferences
```bash
GET /api/notifications/preferences/user123
```

#### Update User Preferences
```bash
PUT /api/notifications/preferences/user123
Content-Type: application/json

{
  "pushNotifications": true,
  "emailNotifications": true,
  "smsNotifications": false,
  "sessionReminders": true,
  "assignmentDeadlines": true,
  "paymentConfirmations": true,
  "systemUpdates": true,
  "marketingEmails": false,
  "weeklyDigest": true
}
```

#### Send with Preferences Check
```bash
POST /api/notifications/send-with-preferences
Content-Type: application/json

{
  "userId": "user123",
  "title": "Payment Confirmed",
  "body": "Your payment of ₹5000 has been processed.",
  "type": "payment_confirmation",
  "data": {
    "amount": 5000,
    "transactionId": "txn123"
  }
}
```

### **System Status**

#### Get Notification Service Status
```bash
GET /api/notifications/status
```

**Response:**
```json
{
  "success": true,
  "service": "AWS SNS",
  "region": "us-east-1",
  "topics": {
    "email": "configured",
    "push": "configured",
    "sms": "configured"
  },
  "features": [
    "Push Notifications",
    "Email Notifications",
    "SMS Notifications",
    "Session Reminders",
    "Assignment Deadlines",
    "Payment Confirmations",
    "System Updates"
  ]
}
```

## 🔧 **Setup Instructions**

### **1. AWS SNS Topics Setup**

Run the setup script to create SNS topics:
```bash
cd kalpla-backend
node scripts/setup-sns.js
```

This creates:
- `kalpla-push-notifications`
- `kalpla-email-notifications`
- `kalpla-sms-notifications`
- `kalpla-system-alerts`

### **2. Email Notifications Setup**

Set up email subscriptions:
```bash
node scripts/setup-email-notifications.js
```

**Important:** Check email inboxes for SNS confirmation links and click them to activate subscriptions.

### **3. Environment Variables**

Ensure these are set in your `.env` file:
```bash
# AWS Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key

# SNS Topic ARNs
AWS_SNS_EMAIL_TOPIC_ARN=arn:aws:sns:us-east-1:112914241644:kalpla-email-notifications
AWS_SNS_PUSH_TOPIC_ARN=arn:aws:sns:us-east-1:112914241644:kalpla-push-notifications
AWS_SNS_SMS_TOPIC_ARN=arn:aws:sns:us-east-1:112914241644:kalpla-sms-notifications
```

## 📱 **Mobile App Integration**

### **1. Register Device Token**

When a user logs in, register their device token:
```javascript
// Get FCM token from Firebase
const fcmToken = await messaging().getToken();

// Register with backend
await fetch('/api/notifications/device-token', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userId: currentUser.id,
    deviceToken: fcmToken
  })
});
```

### **2. Handle Notifications**

Set up notification handlers:
```javascript
// Handle foreground notifications
messaging().onMessage(async (remoteMessage) => {
  console.log('Received notification:', remoteMessage);
  // Show in-app notification
});

// Handle background notifications
messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log('Background notification:', remoteMessage);
});
```

## 🧪 **Testing**

### **Test Push Notifications**
```bash
curl -X POST http://localhost:3001/api/notifications/send \
  -H "Content-Type: application/json" \
  -d '{"userId":"test-user","title":"Test","body":"Hello from Kalpla!"}'
```

### **Test Email Notifications**
```bash
curl -X POST http://localhost:3001/api/notifications/test-email \
  -H "Content-Type: application/json" \
  -d '{"email":"test@kalpla.in","subject":"Test Email","message":"This is a test email from Kalpla!"}'
```

### **Test SMS Notifications**
```bash
curl -X POST http://localhost:3001/api/notifications/test-sms \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber":"+1234567890","message":"Test SMS from Kalpla!"}'
```

## 📊 **Monitoring & Analytics**

### **CloudWatch Metrics**
- Monitor SNS delivery success rates
- Track notification volume
- Set up alarms for failures

### **Notification History**
- All notifications are logged in the database
- Track delivery status and user engagement
- Generate analytics reports

## 💰 **Cost Optimization**

### **AWS SNS Pricing**
- **Push Notifications**: $0.50 per million messages
- **Email**: $0.10 per 100,000 messages
- **SMS**: $0.75 per 100 messages (varies by region)

### **Best Practices**
- Use user preferences to reduce unnecessary notifications
- Batch notifications when possible
- Monitor usage and optimize based on user behavior

## 🔒 **Security**

### **Authentication**
- All endpoints require valid user authentication
- Device tokens are encrypted and stored securely
- User preferences are protected by user ID validation

### **Privacy**
- Users can opt-out of any notification type
- Marketing emails are separate from system notifications
- GDPR compliant data handling

## 🚀 **Production Deployment**

### **Pre-deployment Checklist**
- [ ] SNS topics created and configured
- [ ] Email subscriptions confirmed
- [ ] SMS service configured (if needed)
- [ ] Environment variables set
- [ ] Monitoring and alerts configured
- [ ] Cost budgets set up

### **Scaling Considerations**
- SNS automatically scales to handle millions of notifications
- Consider using SQS for high-volume scenarios
- Implement rate limiting for API endpoints
- Monitor AWS service limits

## 📞 **Support**

For issues or questions:
- Check AWS CloudWatch logs
- Review SNS delivery metrics
- Test with the provided endpoints
- Contact AWS support for SNS-specific issues

---

**Last Updated:** October 5, 2025  
**Version:** 1.0.0  
**Status:** Production Ready ✅
