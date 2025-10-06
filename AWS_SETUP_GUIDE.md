# AWS Configuration Guide for Kalpla

## Required AWS Services

### 1. AWS IVS (Interactive Video Service)
- **Purpose**: Live streaming and video playback
- **Required Actions**:
  - Create IVS channels for live sessions
  - Set up IVS Real-Time for interactive features
  - Configure streaming keys and endpoints

### 2. AWS S3 (Simple Storage Service)
- **Purpose**: Video file storage and static assets
- **Required Actions**:
  - Create S3 bucket for video storage
  - Configure CORS policy
  - Set up lifecycle policies for cost optimization

### 3. AWS CloudFront (CDN)
- **Purpose**: Global content delivery and video streaming
- **Required Actions**:
  - Create CloudFront distribution
  - Configure origin access control
  - Set up custom domain (optional)

## AWS Credentials Setup

### Option 1: AWS CLI Configuration (Recommended for Development)
```bash
# Install AWS CLI
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# Configure credentials
aws configure
# Enter your Access Key ID, Secret Access Key, Region, and Output format
```

### Option 2: Environment Variables (Recommended for Production)
```bash
# Set in your .env file
AWS_ACCESS_KEY_ID=your_access_key_id
AWS_SECRET_ACCESS_KEY=your_secret_access_key
AWS_REGION=us-east-1
AWS_S3_BUCKET=kalpla-videos-prod
AWS_CLOUDFRONT_DOMAIN=your-cloudfront-domain.cloudfront.net
```

### Option 3: IAM Roles (Recommended for EC2/ECS)
- Attach IAM role to your EC2 instance or ECS task
- No need to store credentials in environment variables

## Required IAM Permissions

Create an IAM user or role with the following policy:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "ivs:CreateChannel",
                "ivs:GetChannel",
                "ivs:DeleteChannel",
                "ivs:ListChannels",
                "ivs:CreateStreamKey",
                "ivs:GetStreamKey",
                "ivs:DeleteStreamKey",
                "ivs-realtime:CreateStage",
                "ivs-realtime:GetStage",
                "ivs-realtime:DeleteStage",
                "ivs-realtime:ListStages"
            ],
            "Resource": "*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "s3:GetObject",
                "s3:PutObject",
                "s3:DeleteObject",
                "s3:ListBucket"
            ],
            "Resource": [
                "arn:aws:s3:::kalpla-videos-prod",
                "arn:aws:s3:::kalpla-videos-prod/*"
            ]
        },
        {
            "Effect": "Allow",
            "Action": [
                "cloudfront:CreateInvalidation",
                "cloudfront:GetInvalidation",
                "cloudfront:ListInvalidations"
            ],
            "Resource": "*"
        }
    ]
}
```

## Step-by-Step Setup

### 1. Create S3 Bucket
```bash
aws s3 mb s3://kalpla-videos-prod --region us-east-1
aws s3api put-bucket-cors --bucket kalpla-videos-prod --cors-configuration file://cors-config.json
```

### 2. Create IVS Channel
```bash
aws ivs create-channel --name "kalpla-live-sessions" --type STANDARD
```

### 3. Create CloudFront Distribution
```bash
# Use AWS Console or CloudFormation for CloudFront setup
# This requires more complex configuration
```

## Environment Configuration

Update your `.env` file with real AWS credentials:

```bash
# AWS Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...
AWS_S3_BUCKET=kalpla-videos-prod
AWS_CLOUDFRONT_DOMAIN=d1234567890.cloudfront.net

# IVS Configuration
IVS_CHANNEL_ARN=arn:aws:ivs:us-east-1:123456789012:channel/abc123
IVS_STREAM_KEY=sk_us-east-1_abc123...
```

## Testing AWS Integration

Run the following command to test AWS connectivity:

```bash
cd kalpla-backend
npm run test:aws
```

## Security Best Practices

1. **Never commit AWS credentials to version control**
2. **Use IAM roles instead of access keys when possible**
3. **Rotate access keys regularly**
4. **Use least privilege principle for IAM permissions**
5. **Enable CloudTrail for audit logging**
6. **Use AWS Secrets Manager for sensitive data**

## Cost Optimization

1. **Set up S3 lifecycle policies** to move old videos to cheaper storage
2. **Use CloudFront caching** to reduce S3 requests
3. **Monitor IVS usage** and optimize channel usage
4. **Set up billing alerts** to monitor costs

## Troubleshooting

### Common Issues:
1. **Access Denied**: Check IAM permissions
2. **Region Mismatch**: Ensure all services are in the same region
3. **CORS Errors**: Verify S3 CORS configuration
4. **CloudFront Issues**: Check origin access control settings

### Debug Commands:
```bash
# Test S3 access
aws s3 ls s3://kalpla-videos-prod

# Test IVS access
aws ivs list-channels

# Test CloudFront
aws cloudfront list-distributions
```

