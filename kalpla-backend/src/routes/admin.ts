import express from 'express';
import userRoutes from './admin/users';
import videoRoutes from './admin/videos';
import programRoutes from './admin/programs';
import mentorRoutes from './admin/mentors';
import studentRoutes from './admin/students';
import analyticsRoutes from './admin/analytics';

const router = express.Router();

// Mount all admin sub-routes
router.use('/', userRoutes);
router.use('/', videoRoutes);
router.use('/', programRoutes);
router.use('/', mentorRoutes);
router.use('/', studentRoutes);
router.use('/', analyticsRoutes);

export default router;