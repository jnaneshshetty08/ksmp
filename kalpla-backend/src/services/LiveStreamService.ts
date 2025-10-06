import { IvsClient, CreateChannelCommand, GetChannelCommand, DeleteChannelCommand } from '@aws-sdk/client-ivs';
import { IVSRealTimeClient, CreateStageCommand, GetStageCommand, DeleteStageCommand } from '@aws-sdk/client-ivs-realtime';

export class LiveStreamService {
  private ivsClient: IvsClient;
  private ivsRealTimeClient: IVSRealTimeClient;

  constructor() {
    this.ivsClient = new IvsClient({
      region: process.env.AWS_IVS_REGION || 'us-east-1',
    });
    
    this.ivsRealTimeClient = new IVSRealTimeClient({
      region: process.env.AWS_IVS_REGION || 'us-east-1',
    });
  }

  /**
   * Create a new IVS channel for live streaming
   */
  async createChannel(mentorId: string, sessionId: string, title: string) {
    try {
      const command = new CreateChannelCommand({
        name: `session-${sessionId}`,
        type: 'STANDARD',
        latencyMode: 'LOW',
        tags: {
          mentorId,
          sessionId,
          type: 'live-session'
        }
      });

      const response = await this.ivsClient.send(command);
      
      return {
        success: true,
        channel: {
          arn: response.channel?.arn,
          name: response.channel?.name,
          ingestEndpoint: response.channel?.ingestEndpoint,
          playbackUrl: response.channel?.playbackUrl,
          streamKey: response.streamKey?.value
        }
      };
    } catch (error) {
      console.error('Error creating IVS channel:', error);
      return {
        success: false,
        error: 'Failed to create live stream channel'
      };
    }
  }

  /**
   * Create a real-time stage for interactive features
   */
  async createStage(sessionId: string, name: string) {
    try {
      const command = new CreateStageCommand({
        name: `stage-${sessionId}`,
        tags: {
          sessionId,
          type: 'interactive-stage'
        }
      });

      const response = await this.ivsRealTimeClient.send(command);
      
      return {
        success: true,
        stage: {
          arn: response.stage?.arn,
          name: response.stage?.name,
          activeSessionId: response.stage?.activeSessionId
        }
      };
    } catch (error) {
      console.error('Error creating IVS stage:', error);
      return {
        success: false,
        error: 'Failed to create interactive stage'
      };
    }
  }

  /**
   * Get channel information
   */
  async getChannel(channelArn: string) {
    try {
      const command = new GetChannelCommand({
        arn: channelArn
      });

      const response = await this.ivsClient.send(command);
      
      return {
        success: true,
        channel: response.channel
      };
    } catch (error) {
      console.error('Error getting channel:', error);
      return {
        success: false,
        error: 'Failed to get channel information'
      };
    }
  }

  /**
   * Get stage information
   */
  async getStage(stageArn: string) {
    try {
      const command = new GetStageCommand({
        arn: stageArn
      });

      const response = await this.ivsRealTimeClient.send(command);
      
      return {
        success: true,
        stage: response.stage
      };
    } catch (error) {
      console.error('Error getting stage:', error);
      return {
        success: false,
        error: 'Failed to get stage information'
      };
    }
  }

  /**
   * Delete a channel
   */
  async deleteChannel(channelArn: string) {
    try {
      const command = new DeleteChannelCommand({
        arn: channelArn
      });

      await this.ivsClient.send(command);
      
      return {
        success: true
      };
    } catch (error) {
      console.error('Error deleting channel:', error);
      return {
        success: false,
        error: 'Failed to delete channel'
      };
    }
  }

  /**
   * Delete a stage
   */
  async deleteStage(stageArn: string) {
    try {
      const command = new DeleteStageCommand({
        arn: stageArn
      });

      await this.ivsRealTimeClient.send(command);
      
      return {
        success: true
      };
    } catch (error) {
      console.error('Error deleting stage:', error);
      return {
        success: false,
        error: 'Failed to delete stage'
      };
    }
  }

  /**
   * Generate stream key for a channel
   */
  async generateStreamKey(channelArn: string) {
    try {
      // This would typically be done through the AWS SDK
      // For now, we'll return a mock stream key
      return {
        success: true,
        streamKey: `sk_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      };
    } catch (error) {
      console.error('Error generating stream key:', error);
      return {
        success: false,
        error: 'Failed to generate stream key'
      };
    }
  }
}
