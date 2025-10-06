#!/usr/bin/env node

const { SNSClient, CreateTopicCommand, ListTopicsCommand } = require('@aws-sdk/client-sns');
require('dotenv').config();

async function setupSNSTopics() {
  console.log('🚀 Setting up AWS SNS Topics for Kalpla...\n');

  const snsClient = new SNSClient({
    region: process.env.AWS_REGION || 'us-east-1',
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });

  try {
    // List existing topics
    console.log('📋 Checking existing SNS topics...');
    const listCommand = new ListTopicsCommand({});
    const listResponse = await snsClient.send(listCommand);
    
    const existingTopics = listResponse.Topics || [];
    console.log(`Found ${existingTopics.length} existing topics`);

    // Topics to create
    const topicsToCreate = [
      {
        name: 'kalpla-push-notifications',
        description: 'Push notifications for Kalpla app users'
      },
      {
        name: 'kalpla-email-notifications',
        description: 'Email notifications for Kalpla users'
      },
      {
        name: 'kalpla-sms-notifications',
        description: 'SMS notifications for Kalpla users'
      },
      {
        name: 'kalpla-system-alerts',
        description: 'System alerts and admin notifications'
      }
    ];

    console.log('\n📱 Creating SNS topics...');
    
    for (const topic of topicsToCreate) {
      // Check if topic already exists
      const existingTopic = existingTopics.find(t => 
        t.TopicArn && t.TopicArn.includes(topic.name)
      );

      if (existingTopic) {
        console.log(`✅ Topic '${topic.name}' already exists: ${existingTopic.TopicArn}`);
      } else {
        try {
          const createCommand = new CreateTopicCommand({
            Name: topic.name,
            Attributes: {
              DisplayName: topic.description,
            },
          });

          const response = await snsClient.send(createCommand);
          console.log(`✅ Created topic '${topic.name}': ${response.TopicArn}`);
        } catch (error) {
          console.error(`❌ Failed to create topic '${topic.name}':`, error.message);
        }
      }
    }

    console.log('\n🎉 SNS topics setup completed!');
    console.log('\n📝 Next steps:');
    console.log('1. Update your .env file with the topic ARNs');
    console.log('2. Configure mobile app to register device tokens');
    console.log('3. Set up email/SMS subscriptions as needed');
    console.log('\n💡 Topic ARNs:');
    
    // List all topics again to show ARNs
    const finalListResponse = await snsClient.send(listCommand);
    const allTopics = finalListResponse.Topics || [];
    
    allTopics.forEach(topic => {
      if (topic.TopicArn && topic.TopicArn.includes('kalpla')) {
        console.log(`   ${topic.TopicArn}`);
      }
    });

  } catch (error) {
    console.error('❌ Error setting up SNS topics:', error);
    
    if (error.name === 'CredentialsProviderError') {
      console.log('\n💡 Troubleshooting:');
      console.log('1. Make sure AWS credentials are configured');
      console.log('2. Run: aws configure');
      console.log('3. Or set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY in .env');
    }
    
    process.exit(1);
  }
}

// Run the setup
setupSNSTopics();
