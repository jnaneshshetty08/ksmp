import express from 'express';
import { VideoAccessService } from '../services/VideoAccessService';
import { authenticateToken, requireStudent, requireMentorOrAdmin } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

/**
 * GET /api/video/access/:sessionId
 * Get signed URL for video access
 */
router.get('/access/:sessionId', requireStudent, async (req, res) => {
  try {
    const { sessionId } = req.params;
    const studentId = req.studentId;

    const videoAccess = await VideoAccessService.getVideoAccess({
      studentId: studentId!,
      sessionId,
    });

    res.json({
      success: true,
      data: videoAccess,
    });
  } catch (error) {
    console.error('Error getting video access:', error);
    res.status(403).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get video access',
    });
  }
});

/**
 * POST /api/video/progress
 * Update video progress
 */
router.post('/progress', requireStudent, async (req, res) => {
  try {
    const { sessionId, watchedSeconds, completed } = req.body;
    const studentId = req.studentId;

    if (!sessionId || watchedSeconds === undefined) {
      return res.status(400).json({
        success: false,
        error: 'sessionId and watchedSeconds are required',
      });
    }

    await VideoAccessService.updateVideoProgress({
      studentId: studentId!,
      sessionId,
      watchedSeconds,
      completed,
    });

    res.json({
      success: true,
      message: 'Progress updated successfully',
    });
  } catch (error) {
    console.error('Error updating video progress:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update video progress',
    });
  }
});

/**
 * GET /api/video/module/:moduleId/progress
 * Get video progress for a specific module
 */
router.get('/module/:moduleId/progress', requireStudent, async (req, res) => {
  try {
    const { moduleId } = req.params;
    const studentId = req.studentId;

    const progress = await VideoAccessService.getModuleProgress(studentId!, moduleId);

    res.json({
      success: true,
      data: progress,
    });
  } catch (error) {
    console.error('Error getting module progress:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get module progress',
    });
  }
});

/**
 * GET /api/video/course/progress
 * Get overall course progress
 */
router.get('/course/progress', requireStudent, async (req, res) => {
  try {
    const studentId = req.studentId;

    const progress = await VideoAccessService.getCourseProgress(studentId!);

    if (!progress) {
      return res.status(404).json({
        success: false,
        error: 'No active enrollment found',
      });
    }

    res.json({
      success: true,
      data: progress,
    });
  } catch (error) {
    console.error('Error getting course progress:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get course progress',
    });
  }
});

/**
 * GET /api/video/module/:moduleId/access
 * Check if student can access a module (progression lock)
 */
router.get('/module/:moduleId/access', requireStudent, async (req, res) => {
  try {
    const { moduleId } = req.params;
    const studentId = req.studentId;

    const canAccess = await VideoAccessService.canAccessModule(studentId!, moduleId);

    res.json({
      success: true,
      data: {
        canAccess,
        moduleId,
      },
    });
  } catch (error) {
    console.error('Error checking module access:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to check module access',
    });
  }
});

export default router;
