import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface VideoProgressUpdate {
  studentId: string;
  sessionId: string;
  watchedSeconds: number;
  completed?: boolean;
}

export class VideoProgressService {
  /**
   * Update video progress
   */
  static async updateVideoProgress(update: VideoProgressUpdate): Promise<void> {
    const { studentId, sessionId, watchedSeconds, completed } = update;

    // Get session duration to determine completion
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      select: { duration: true },
    });

    const sessionDuration = session?.duration || 0;
    const completionThreshold = 0.9; // 90% completion required
    const isCompleted = completed || (sessionDuration > 0 && watchedSeconds >= sessionDuration * completionThreshold);

    await prisma.videoProgress.upsert({
      where: {
        studentId_sessionId: {
          studentId,
          sessionId,
        },
      },
      update: {
        watchedSeconds,
        completed: isCompleted,
        lastWatched: new Date(),
      },
      create: {
        studentId,
        sessionId,
        watchedSeconds,
        completed: isCompleted,
        lastWatched: new Date(),
      },
    });

    // Log analytics event
    await prisma.analyticsEvent.create({
      data: {
        userId: studentId,
        sessionId,
        event: 'video_progress_updated',
        properties: {
          watchedSeconds,
          completed: isCompleted,
          progressPercentage: sessionDuration > 0 ? (watchedSeconds / sessionDuration) * 100 : 0,
        },
      },
    });
  }

  /**
   * Get student's video progress for a module
   */
  static async getModuleProgress(studentId: string, moduleId: string) {
    const sessions = await prisma.session.findMany({
      where: {
        moduleId,
        videoS3Key: {
          not: null,
        },
      },
      include: {
        videoProgress: {
          where: { studentId },
        },
      },
      orderBy: { orderIndex: 'asc' },
    });

    return sessions.map(session => ({
      sessionId: session.id,
      title: session.title,
      duration: session.duration || 0,
      progress: session.videoProgress[0] || {
        watchedSeconds: 0,
        completed: false,
        lastWatched: null,
      },
    }));
  }

  /**
   * Get overall course progress for student
   */
  static async getCourseProgress(studentId: string) {
    const enrollment = await prisma.enrollment.findFirst({
      where: {
        userId: studentId,
        status: 'ACTIVE',
      },
      include: {
        program: {
          include: {
            modules: {
              include: {
                sessions: {
                  where: {
                    videoS3Key: {
                      not: null,
                    },
                  },
                  include: {
                    videoProgress: {
                      where: { studentId },
                    },
                  },
                },
              },
              orderBy: { order: 'asc' },
            },
          },
        },
      },
    });

    if (!enrollment) {
      return null;
    }

    const modules = enrollment.program.modules.map(module => {
      const totalSessions = module.sessions.length;
      const completedSessions = module.sessions.filter(session =>
        session.videoProgress[0]?.completed
      ).length;

      return {
        moduleId: module.id,
        title: module.title,
        order: module.order,
        totalSessions,
        completedSessions,
        progressPercentage: totalSessions > 0 ? (completedSessions / totalSessions) * 100 : 0,
        sessions: module.sessions.map(session => ({
          sessionId: session.id,
          title: session.title,
          duration: session.duration || 0,
          progress: session.videoProgress[0] || {
            watchedSeconds: 0,
            completed: false,
            lastWatched: null,
          },
        })),
      };
    });

    const totalSessions = modules.reduce((sum, module) => sum + module.totalSessions, 0);
    const completedSessions = modules.reduce((sum, module) => sum + module.completedSessions, 0);
    const overallProgress = totalSessions > 0 ? (completedSessions / totalSessions) * 100 : 0;

    return {
      programId: enrollment.program.id,
      programName: enrollment.program.name,
      overallProgress,
      totalSessions,
      completedSessions,
      modules,
    };
  }

  /**
   * Check if student has access to next module (progression lock)
   */
  static async canAccessModule(studentId: string, moduleId: string): Promise<boolean> {
    // Get the module
    const module = await prisma.module.findUnique({
      where: { id: moduleId },
      include: {
        program: {
          include: {
            modules: {
              orderBy: { order: 'asc' },
            },
          },
        },
      },
    });

    if (!module) return false;

    // First module is always accessible
    if (module.order === 1) return true;

    // Find previous module
    const previousModule = module.program.modules.find(m => m.order === module.order - 1);
    if (!previousModule) return true;

    // Check if previous module is completed
    const previousModuleProgress = await this.getModuleProgress(studentId, previousModule.id);
    const totalSessions = previousModuleProgress.length;
    const completedSessions = previousModuleProgress.filter(p => p.progress.completed).length;

    // Require 90% completion of previous module
    return totalSessions > 0 && (completedSessions / totalSessions) >= 0.9;
  }
}
