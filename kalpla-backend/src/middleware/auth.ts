import { Request, Response, NextFunction } from 'express';
import { PrismaClient, UserRole } from '@prisma/client';

const prisma = new PrismaClient();

// Extend Express Request interface
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name: string;
        role: UserRole;
        status: string;
      };
      studentId?: string;
      mentorId?: string;
      adminId?: string;
    }
  }
}

/**
 * Middleware to verify JWT token and set user context
 */
export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // For development, we'll use a simple header-based auth
    // In production, this should verify JWT tokens
    const authHeader = req.headers.authorization;
    const studentId = req.headers['x-student-id'] as string;
    const mentorId = req.headers['x-mentor-id'] as string;
    const adminId = req.headers['x-admin-id'] as string;

    if (!studentId && !mentorId && !adminId) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }

    let userId: string;
    if (studentId) userId = studentId;
    else if (mentorId) userId = mentorId;
    else if (adminId) userId = adminId;
    else {
      return res.status(401).json({
        success: false,
        error: 'Invalid authentication'
      });
    }

    // Fetch user from database
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
      }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'User not found'
      });
    }

    if (user.status !== 'ACTIVE') {
      return res.status(403).json({
        success: false,
        error: 'Account is not active'
      });
    }

    // Set user context
    req.user = user;
    req.studentId = user.role === 'STUDENT' ? user.id : undefined;
    req.mentorId = user.role === 'MENTOR' ? user.id : undefined;
    req.adminId = user.role === 'ADMIN' ? user.id : undefined;

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(500).json({
      success: false,
      error: 'Authentication failed'
    });
  }
};

/**
 * Middleware to check if user has student role
 */
export const requireStudent = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== 'STUDENT') {
    return res.status(403).json({
      success: false,
      error: 'Student access required'
    });
  }
  next();
};

/**
 * Middleware to check if user has mentor role
 */
export const requireMentor = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== 'MENTOR') {
    return res.status(403).json({
      success: false,
      error: 'Mentor access required'
    });
  }
  next();
};

/**
 * Middleware to check if user has admin role
 */
export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== 'ADMIN') {
    return res.status(403).json({
      success: false,
      error: 'Admin access required'
    });
  }
  next();
};

/**
 * Middleware to check if user has mentor or admin role
 */
export const requireMentorOrAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || (req.user.role !== 'MENTOR' && req.user.role !== 'ADMIN')) {
    return res.status(403).json({
      success: false,
      error: 'Mentor or Admin access required'
    });
  }
  next();
};

/**
 * Middleware to check if user has any of the specified roles
 */
export const requireRoles = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: `Access denied. Required roles: ${roles.join(', ')}`
      });
    }
    next();
  };
};
