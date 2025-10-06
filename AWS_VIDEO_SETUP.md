# AWS Video Infrastructure Setup Guide

This guide outlines the AWS infrastructure setup required for secure video access in the Kalpla Student Dashboard.

## 🏗️ Architecture Overview

```
[Student Dashboard] → [CloudFront CDN] → [S3 Bucket] → [Signed URLs]
                    ↓
              [Progress Tracking] → [PostgreSQL Database]
```

## 📋 Prerequisites

- AWS Account with appropriate permissions
- AWS CLI configured
- Domain name (optional, for custom CloudFront distribution)

## 🔧 Step 1: S3 Bucket Setup

### Create S3 Bucket for Video Storage

```bash
# Create bucket (replace with your unique bucket name)
aws s3 mb s3://kalpla-video-storage-prod

# Enable versioning
aws s3api put-bucket-versioning \
  --bucket kalpla-video-storage-prod \
  --versioning-configuration Status=Enabled

# Configure bucket policy for private access
cat > bucket-policy.json << EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "DenyPublicAccess",
      "Effect": "Deny",
      "Principal": "*",
      "Action": "s3:*",
      "Resource": [
        "arn:aws:s3:::kalpla-video-storage-prod",
        "arn:aws:s3:::kalpla-video-storage-prod/*"
      ],
      "Condition": {
        "Bool": {
          "aws:SecureTransport": "false"
        }
      }
    }
  ]
}
EOF

aws s3api put-bucket-policy \
  --bucket kalpla-video-storage-prod \
  --policy file://bucket-policy.json
```

### Create IAM User for Application Access

```bash
# Create IAM user
aws iam create-user --user-name kalpla-video-service

# Create access key
aws iam create-access-key --user-name kalpla-video-service

# Create policy for S3 access
cat > s3-video-policy.json << EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject",
        "s3:DeleteObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::kalpla-video-storage-prod",
        "arn:aws:s3:::kalpla-video-storage-prod/*"
      ]
    }
  ]
}
EOF

aws iam create-policy \
  --policy-name KalplaVideoS3Access \
  --policy-document file://s3-video-policy.json

# Attach policy to user
aws iam attach-user-policy \
  --user-name kalpla-video-service \
  --policy-arn arn:aws:iam::YOUR_ACCOUNT_ID:policy/KalplaVideoS3Access
```

## 🌐 Step 2: CloudFront Distribution Setup

### Create CloudFront Distribution

```bash
# Create CloudFront distribution configuration
cat > cloudfront-config.json << EOF
{
  "CallerReference": "kalpla-video-distribution-$(date +%s)",
  "Comment": "Kalpla Video Distribution",
  "DefaultRootObject": "index.html",
  "Origins": {
    "Quantity": 1,
    "Items": [
      {
        "Id": "S3-kalpla-video-storage-prod",
        "DomainName": "kalpla-video-storage-prod.s3.amazonaws.com",
        "S3OriginConfig": {
          "OriginAccessIdentity": ""
        }
      }
    ]
  },
  "DefaultCacheBehavior": {
    "TargetOriginId": "S3-kalpla-video-storage-prod",
    "ViewerProtocolPolicy": "redirect-to-https",
    "TrustedSigners": {
      "Enabled": true,
      "Quantity": 1,
      "Items": ["self"]
    },
    "ForwardedValues": {
      "QueryString": false,
      "Cookies": {
        "Forward": "none"
      }
    },
    "MinTTL": 0,
    "DefaultTTL": 3600,
    "MaxTTL": 86400
  },
  "Enabled": true,
  "PriceClass": "PriceClass_100"
}
EOF

aws cloudfront create-distribution --distribution-config file://cloudfront-config.json
```

### Create CloudFront Key Pair for Signed URLs

```bash
# Create CloudFront key pair (requires AWS Console access)
# Go to AWS Console → CloudFront → Public Keys → Create Public Key
# Download the private key and note the key pair ID

# Create key group
aws cloudfront create-key-group \
  --key-group-config '{
    "Name": "kalpla-video-keys",
    "Items": ["YOUR_KEY_PAIR_ID"]
  }'
```

## 🔐 Step 3: Environment Variables Setup

### Backend Environment Variables

Add to your `.env` file:

```env
# AWS Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key_here
AWS_SECRET_ACCESS_KEY=your_secret_key_here

# S3 Configuration
S3_VIDEO_BUCKET=kalpla-video-storage-prod

# CloudFront Configuration
CLOUDFRONT_DISTRIBUTION_ID=your_distribution_id
CLOUDFRONT_KEY_PAIR_ID=your_key_pair_id
CLOUDFRONT_PRIVATE_KEY_PATH=./cloudfront-private-key.pem

# Database
DATABASE_URL=postgresql://username:password@localhost:5432/kalpla_db
```

### Frontend Environment Variables

Add to your `.env.local` file:

```env
# Backend API
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
BACKEND_URL=http://localhost:3001

# CloudFront
NEXT_PUBLIC_CLOUDFRONT_DOMAIN=your_distribution_domain.cloudfront.net
```

## 📁 Step 4: Video Upload Structure

### Recommended S3 Folder Structure

```
kalpla-video-storage-prod/
├── modules/
│   ├── module-1/
│   │   ├── session-1.mp4
│   │   ├── session-2.mp4
│   │   └── ...
│   ├── module-2/
│   │   ├── session-1.mp4
│   │   └── ...
│   └── ...
├── thumbnails/
│   ├── module-1/
│   │   ├── session-1.jpg
│   │   └── ...
│   └── ...
└── metadata/
    ├── module-1/
    │   ├── session-1.json
    │   └── ...
    └── ...
```

### Video Upload Script

Create `scripts/upload-video.js`:

```javascript
const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');

const s3 = new AWS.S3({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

async function uploadVideo(moduleId, sessionId, videoPath) {
  const key = `modules/module-${moduleId}/session-${sessionId}.mp4`;
  
  const uploadParams = {
    Bucket: process.env.S3_VIDEO_BUCKET,
    Key: key,
    Body: fs.createReadStream(videoPath),
    ContentType: 'video/mp4',
    ServerSideEncryption: 'AES256',
  };

  try {
    const result = await s3.upload(uploadParams).promise();
    console.log(`Video uploaded: ${result.Location}`);
    return key;
  } catch (error) {
    console.error('Upload failed:', error);
    throw error;
  }
}

// Usage
if (require.main === module) {
  const [,, moduleId, sessionId, videoPath] = process.argv;
  uploadVideo(moduleId, sessionId, videoPath);
}

module.exports = { uploadVideo };
```

## 🔄 Step 5: Database Migration

### Run Prisma Migration

```bash
cd kalpla-backend
npx prisma migrate dev --name add-video-progress-tracking
npx prisma generate
```

### Seed Sample Data

Create `prisma/seed-videos.ts`:

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedVideos() {
  // Create sample modules and sessions with video data
  const modules = [
    { title: 'Ideation & Validation', order: 1 },
    { title: 'Business Model Design', order: 2 },
    // ... add more modules
  ];

  for (const moduleData of modules) {
    const module = await prisma.module.create({
      data: {
        ...moduleData,
        programId: 'your-program-id', // Replace with actual program ID
        description: `Learn ${moduleData.title.toLowerCase()}`,
        duration: 4, // weeks
      },
    });

    // Create 20 sessions per module
    for (let i = 1; i <= 20; i++) {
      await prisma.session.create({
        data: {
          moduleId: module.id,
          title: `Session ${i}: ${moduleData.title} - Part ${i}`,
          description: `Detailed session on ${moduleData.title}`,
          type: 'RECORDED',
          status: 'COMPLETED',
          startTime: new Date(),
          endTime: new Date(Date.now() + 3600000), // 1 hour later
          videoS3Key: `modules/module-${module.order}/session-${i}.mp4`,
          duration: 3600, // 1 hour in seconds
          orderIndex: i,
          isLive: false,
          creatorId: 'your-mentor-id', // Replace with actual mentor ID
        },
      });
    }
  }
}

seedVideos()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

## 🧪 Step 6: Testing

### Test Video Access

```bash
# Test signed URL generation
curl -X GET "http://localhost:3001/api/video/access/session-id" \
  -H "x-student-id: student-id" \
  -H "Content-Type: application/json"

# Test progress tracking
curl -X POST "http://localhost:3001/api/video/progress" \
  -H "x-student-id: student-id" \
  -H "Content-Type: application/json" \
  -d '{"sessionId": "session-id", "watchedSeconds": 300}'
```

## 📊 Step 7: Monitoring & Analytics

### CloudWatch Metrics

Set up CloudWatch alarms for:
- S3 request metrics
- CloudFront cache hit ratio
- Error rates
- Bandwidth usage

### Cost Optimization

- Use S3 Intelligent Tiering for long-term storage
- Configure CloudFront cache behaviors for different content types
- Set up lifecycle policies for old videos

## 🔒 Security Best Practices

1. **Access Control**
   - Use IAM roles with minimal permissions
   - Rotate access keys regularly
   - Enable MFA for AWS console access

2. **Video Security**
   - Use signed URLs with short expiration times
   - Implement watermarking for sensitive content
   - Monitor access patterns for anomalies

3. **Data Protection**
   - Enable S3 server-side encryption
   - Use HTTPS for all video delivery
   - Implement proper CORS policies

## 🚀 Deployment Checklist

- [ ] S3 bucket created and configured
- [ ] CloudFront distribution deployed
- [ ] IAM users and policies set up
- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] Sample videos uploaded
- [ ] Access control tested
- [ ] Monitoring configured
- [ ] Backup strategy implemented

## 📞 Support

For issues or questions:
- Check AWS CloudWatch logs
- Review application logs
- Test with sample videos first
- Verify IAM permissions
- Check network connectivity

## 🔄 Maintenance

### Regular Tasks

1. **Weekly**
   - Review CloudWatch metrics
   - Check for failed video uploads
   - Monitor storage costs

2. **Monthly**
   - Rotate access keys
   - Review access logs
   - Update security policies

3. **Quarterly**
   - Review and optimize costs
   - Update video compression settings
   - Backup critical data

This setup provides a secure, scalable foundation for video delivery in your Kalpla Student Dashboard.
