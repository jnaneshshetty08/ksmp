import { PrismaClient } from '@prisma/client';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { VideoProgressService } from './VideoProgressService';

const prisma = new PrismaClient();

// AWS Configuration
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export interface VideoAccessRequest {
  studentId: string;
  sessionId: string;
}

export interface VideoAccessResponse {
  signedUrl: string;
  expiresAt: Date;
  duration: number;
  progress?: {
    watchedSeconds: number;
    completed: boolean;
    lastWatched: Date;
  };
}

export class VideoAccessService {
  /**
   * Verify student enrollment and generate signed video URL
   */
  static async getVideoAccess(request: VideoAccessRequest): Promise<VideoAccessResponse> {
    const { studentId, sessionId } = request;

    // Verify student enrollment
    const enrollment = await prisma.enrollment.findFirst({
      where: {
        userId: studentId,
        status: 'ACTIVE',
        endDate: {
          gte: new Date(), // Check if enrollment hasn't expired
        },
      },
      include: {
        program: {
          include: {
            modules: {
              include: {
                sessions: {
                  where: { id: sessionId },
                },
              },
            },
          },
        },
      },
    });

    if (!enrollment) {
      throw new Error('Student not enrolled or enrollment expired');
    }

    // Get session details
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: {
        module: true,
      },
    });

    if (!session || !session.videoS3Key) {
      throw new Error('Video not available for this session');
    }

    // Check if session belongs to enrolled program
    const sessionInProgram = enrollment.program.modules.some(module =>
      module.sessions.some(s => s.id === sessionId)
    );

    if (!sessionInProgram) {
      throw new Error('Session not part of enrolled program');
    }

    // Get or create video progress
    let progress = await prisma.videoProgress.findUnique({
      where: {
        studentId_sessionId: {
          studentId,
          sessionId,
        },
      },
    });

    if (!progress) {
      progress = await prisma.videoProgress.create({
        data: {
          studentId,
          sessionId,
          watchedSeconds: 0,
          completed: false,
        },
      });
    }

    // Generate signed URL (valid for 1 hour)
    const expiresIn = 3600; // 1 hour
    const expiresAt = new Date(Date.now() + expiresIn * 1000);

    const command = new GetObjectCommand({
      Bucket: process.env.S3_VIDEO_BUCKET!,
      Key: session.videoS3Key,
    });

    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn });

    return {
      signedUrl,
      expiresAt,
      duration: session.duration || 0,
      progress: {
        watchedSeconds: progress.watchedSeconds,
        completed: progress.completed,
        lastWatched: progress.lastWatched,
      },
    };
  }

  // Re-export methods from VideoProgressService for backward compatibility
  static updateVideoProgress = VideoProgressService.updateVideoProgress;
  static getModuleProgress = VideoProgressService.getModuleProgress;
  static getCourseProgress = VideoProgressService.getCourseProgress;
  static canAccessModule = VideoProgressService.canAccessModule;
}