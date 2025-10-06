# AWS Amplify Backend Setup Guide

## Overview
This guide will help you set up AWS Amplify Gen 2 backend for your Kalpla application with the following services:
- **Authentication**: AWS Cognito for user management
- **Database**: DynamoDB for data storage
- **Storage**: S3 for file storage
- **API**: Lambda functions for business logic
- **Push Notifications**: Firebase integration

## Prerequisites
1. AWS CLI configured with appropriate permissions
2. Node.js and npm installed
3. AWS account with billing enabled

## Setup Steps

### 1. Configure AWS CLI
```bash
aws configure
# Enter your AWS Access Key ID
# Enter your AWS Secret Access Key
# Enter your default region (e.g., us-east-1)
# Enter your default output format (e.g., json)
```

### 2. Install Amplify CLI
```bash
npm install -g @aws-amplify/cli
amplify configure
```

### 3. Initialize Amplify Backend
```bash
cd /Users/jnaneshshetty/Desktop/Project/amplify
npm run dev
```

This will:
- Deploy your backend resources to AWS
- Create Cognito User Pool
- Set up DynamoDB tables
- Deploy Lambda functions
- Configure S3 storage

### 4. Configure Environment Variables
Create a `.env` file in the amplify directory:
```bash
FIREBASE_PROJECT_ID=kalpla-11a78
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@kalpla-11a78.iam.gserviceaccount.com
```

### 5. Deploy Backend
```bash
cd /Users/jnaneshshetty/Desktop/Project/amplify
npm run deploy
```

### 6. Update Frontend Configuration
After deployment, copy the generated `amplify_outputs.json` to your frontend:
```bash
cp amplify_outputs.json ../kalpla-frontend/src/
```

### 7. Install Frontend Dependencies
```bash
cd /Users/jnaneshshetty/Desktop/Project/kalpla-frontend
npm install aws-amplify
```

### 8. Configure Frontend
Update your frontend to use Amplify:

```typescript
// src/lib/amplify.ts
import { Amplify } from 'aws-amplify';
import outputs from '../amplify_outputs.json';

Amplify.configure(outputs);
```

```typescript
// src/app/layout.tsx
import '../lib/amplify';
```

## API Endpoints

Your Amplify backend will provide the following API endpoints:

### Authentication
- `POST /auth/signup` - User registration
- `POST /auth/signin` - User login
- `POST /auth/signout` - User logout
- `POST /auth/forgot-password` - Password reset

### Notifications
- `POST /notifications/fcm-token` - Update FCM token
- `DELETE /notifications/fcm-token/{userId}` - Remove FCM token
- `POST /notifications/send` - Send notification to user
- `POST /notifications/send-multiple` - Send notification to multiple users

### Data Operations
All data operations are handled through Amplify's auto-generated GraphQL API:
- User management
- Program enrollment
- Assignment submissions
- Session management
- Recording storage

## Database Schema

The backend includes the following DynamoDB tables:
- **User**: User profiles and authentication data
- **Program**: Course programs
- **Module**: Course modules
- **Assignment**: Assignments and quizzes
- **Enrollment**: User program enrollments
- **Submission**: Assignment submissions
- **Session**: Live sessions
- **SessionParticipant**: Session participants
- **Recording**: Session recordings
- **Notification**: Push notifications

## Storage

S3 buckets are configured for:
- Profile pictures (`profile-pictures/*`)
- Assignment files (`assignments/*`)
- Session recordings (`recordings/*`)
- Documents (`documents/*`)

## Security

- **Authentication**: AWS Cognito User Pools
- **Authorization**: Role-based access control (RBAC)
- **API Security**: API Gateway with Cognito integration
- **Storage Security**: S3 bucket policies with user-based access

## Monitoring and Logging

- **CloudWatch Logs**: Lambda function logs
- **CloudWatch Metrics**: API Gateway metrics
- **X-Ray Tracing**: Distributed tracing for debugging

## Cost Optimization

- **DynamoDB**: On-demand billing
- **Lambda**: Pay-per-request
- **S3**: Standard storage class
- **API Gateway**: Pay-per-request

## Troubleshooting

### Common Issues

1. **Permission Errors**: Ensure your AWS CLI has the necessary permissions
2. **Resource Limits**: Check AWS service limits in your account
3. **Deployment Failures**: Check CloudFormation stack events
4. **Authentication Issues**: Verify Cognito configuration

### Useful Commands

```bash
# Check deployment status
amplify status

# View logs
amplify logs

# Delete all resources
amplify delete

# Generate client code
amplify codegen
```

## Next Steps

1. Deploy the backend using `npm run dev`
2. Test the API endpoints
3. Integrate with your frontend
4. Set up monitoring and alerts
5. Configure production environment

## Support

For issues and questions:
- AWS Amplify Documentation: https://docs.amplify.aws/
- AWS Support: https://aws.amazon.com/support/
- Amplify Community: https://github.com/aws-amplify/amplify-cli
