#!/usr/bin/env node

const { S3Client, ListBucketsCommand } = require('@aws-sdk/client-s3');
const { IvsClient, ListChannelsCommand } = require('@aws-sdk/client-ivs');
const { CloudFrontClient, ListDistributionsCommand } = require('@aws-sdk/client-cloudfront');

async function testAWSCredentials() {
  console.log('🔍 Testing AWS Credentials...\n');

  const region = process.env.AWS_REGION || 'us-east-1';
  
  try {
    // Test S3
    console.log('📦 Testing S3 connection...');
    const s3Client = new S3Client({ region });
    const s3Command = new ListBucketsCommand({});
    const s3Response = await s3Client.send(s3Command);
    console.log('✅ S3 connection successful');
    console.log(`   Found ${s3Response.Buckets?.length || 0} buckets\n`);

    // Test IVS
    console.log('📺 Testing IVS connection...');
    const ivsClient = new IvsClient({ region });
    const ivsCommand = new ListChannelsCommand({});
    const ivsResponse = await ivsClient.send(ivsCommand);
    console.log('✅ IVS connection successful');
    console.log(`   Found ${ivsResponse.channels?.length || 0} channels\n`);

    // Test CloudFront
    console.log('🌐 Testing CloudFront connection...');
    const cloudFrontClient = new CloudFrontClient({ region });
    const cfCommand = new ListDistributionsCommand({});
    const cfResponse = await cloudFrontClient.send(cfCommand);
    console.log('✅ CloudFront connection successful');
    console.log(`   Found ${cfResponse.DistributionList?.Items?.length || 0} distributions\n`);

    console.log('🎉 All AWS services are accessible!');
    
    // Check for required resources
    console.log('\n📋 Checking for required resources...');
    
    const bucketName = process.env.AWS_S3_BUCKET;
    if (bucketName) {
      const bucketExists = s3Response.Buckets?.some(bucket => bucket.Name === bucketName);
      if (bucketExists) {
        console.log(`✅ Required S3 bucket '${bucketName}' exists`);
      } else {
        console.log(`❌ Required S3 bucket '${bucketName}' not found`);
        console.log('   Run: aws s3 mb s3://' + bucketName);
      }
    }

    const cloudFrontDomain = process.env.AWS_CLOUDFRONT_DOMAIN;
    if (cloudFrontDomain) {
      const distributionExists = cfResponse.DistributionList?.Items?.some(
        dist => dist.DomainName === cloudFrontDomain
      );
      if (distributionExists) {
        console.log(`✅ Required CloudFront domain '${cloudFrontDomain}' exists`);
      } else {
        console.log(`❌ Required CloudFront domain '${cloudFrontDomain}' not found`);
        console.log('   Create a CloudFront distribution in AWS Console');
      }
    }

  } catch (error) {
    console.error('❌ AWS connection failed:', error.message);
    
    if (error.name === 'CredentialsProviderError') {
      console.log('\n💡 Troubleshooting:');
      console.log('   1. Check your AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY');
      console.log('   2. Verify your AWS_REGION is correct');
      console.log('   3. Ensure your IAM user has the required permissions');
      console.log('   4. Run: aws configure');
    }
    
    process.exit(1);
  }
}

// Run the test
testAWSCredentials();

