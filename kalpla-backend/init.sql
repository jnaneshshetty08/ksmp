-- Kalpla Database Initialization Script
-- This script sets up the initial database structure and sample data

-- Create database if it doesn't exist (this will be handled by Docker)
-- CREATE DATABASE kalpla;

-- Connect to the kalpla database
\c kalpla;

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Create custom types/enums (these will be created by Prisma migrations)
-- But we can add some initial data here

-- Insert sample programs
INSERT INTO programs (id, name, description, duration, price, "isActive", "createdAt", "updatedAt") VALUES
('prog_ksmp', 'Kalpla Startup Mentorship Program', 'A comprehensive 12-month program to transform startup ideas into reality', 12, 4999900, true, NOW(), NOW()),
('prog_advanced', 'Advanced Entrepreneurship', 'Advanced course for experienced entrepreneurs', 6, 2999900, true, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Insert sample modules for KSMP
INSERT INTO modules (id, "programId", title, description, "order", duration, "isActive", "createdAt", "updatedAt") VALUES
('mod_foundation', 'prog_ksmp', 'Foundation & Idea Validation', 'Learn the basics of entrepreneurship and validate your startup idea', 1, 4, true, NOW(), NOW()),
('mod_planning', 'prog_ksmp', 'Business Planning & Strategy', 'Develop comprehensive business plans and strategies', 2, 4, true, NOW(), NOW()),
('mod_development', 'prog_ksmp', 'Product Development & MVP', 'Build your minimum viable product and iterate based on feedback', 3, 4, true, NOW(), NOW()),
('mod_marketing', 'prog_ksmp', 'Marketing & Customer Acquisition', 'Learn digital marketing strategies and customer acquisition', 4, 4, true, NOW(), NOW()),
('mod_operations', 'prog_ksmp', 'Operations & Team Building', 'Scale your operations and build effective teams', 5, 4, true, NOW(), NOW()),
('mod_launch', 'prog_ksmp', 'Launch & Growth', 'Launch your startup and implement growth strategies', 6, 4, true, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Insert sample sessions for Foundation module
INSERT INTO sessions (id, "moduleId", title, description, type, status, "startTime", "endTime", "maxParticipants", "orderIndex", "isLive", "createdAt", "updatedAt", "creatorId") VALUES
('sess_intro', 'mod_foundation', 'Introduction to Entrepreneurship', 'Welcome session covering the fundamentals of entrepreneurship', 'LIVE', 'SCHEDULED', NOW() + INTERVAL '1 day', NOW() + INTERVAL '1 day' + INTERVAL '2 hours', 50, 1, false, NOW(), NOW(), 'admin_user'),
('sess_ideation', 'mod_foundation', 'Idea Generation & Validation', 'Learn techniques for generating and validating startup ideas', 'LIVE', 'SCHEDULED', NOW() + INTERVAL '2 days', NOW() + INTERVAL '2 days' + INTERVAL '2 hours', 50, 2, false, NOW(), NOW(), 'admin_user'),
('sess_market_research', 'mod_foundation', 'Market Research Fundamentals', 'Understanding your target market and competition', 'LIVE', 'SCHEDULED', NOW() + INTERVAL '3 days', NOW() + INTERVAL '3 days' + INTERVAL '2 hours', 50, 3, false, NOW(), NOW(), 'admin_user')
ON CONFLICT (id) DO NOTHING;

-- Insert sample admin user
INSERT INTO users (id, "cognitoId", email, name, role, status, "paymentStatus", "paymentAmount", "enrollmentDate", "createdAt", "updatedAt") VALUES
('admin_user', 'admin_cognito_id', 'admin@kalpla.in', 'Kalpla Admin', 'ADMIN', 'ACTIVE', 'COMPLETED', 0, NOW(), NOW(), NOW()),
('mentor_sample', 'mentor_cognito_id', 'mentor@kalpla.in', 'Sample Mentor', 'MENTOR', 'ACTIVE', 'COMPLETED', 0, NOW(), NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Insert sample mentor profile
INSERT INTO mentor_profiles (id, "userId", bio, designation, expertise, "yearsExperience", "isActive", "createdAt", "updatedAt") VALUES
('mentor_profile_1', 'mentor_sample', 'Experienced entrepreneur with 10+ years in the startup ecosystem', 'Senior Entrepreneur', ARRAY['Business Strategy', 'Product Development', 'Fundraising'], 10, true, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Insert sample assignments
INSERT INTO assignments (id, "moduleId", "mentorId", title, description, type, "maxScore", "dueDate", "fileTypes", "isActive", "createdAt", "updatedAt") VALUES
('assign_business_model', 'mod_foundation', 'mentor_sample', 'Business Model Canvas', 'Create a comprehensive business model canvas for your startup idea', 'SUBMISSION', 100, NOW() + INTERVAL '7 days', ARRAY['pdf', 'docx'], true, NOW(), NOW()),
('assign_market_analysis', 'mod_foundation', 'mentor_sample', 'Market Analysis Report', 'Conduct thorough market research and create an analysis report', 'SUBMISSION', 100, NOW() + INTERVAL '14 days', ARRAY['pdf', 'docx'], true, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_cognito_id ON users("cognitoId");
CREATE INDEX IF NOT EXISTS idx_sessions_module_id ON sessions("moduleId");
CREATE INDEX IF NOT EXISTS idx_sessions_start_time ON sessions("startTime");
CREATE INDEX IF NOT EXISTS idx_enrollments_user_id ON enrollments("userId");
CREATE INDEX IF NOT EXISTS idx_enrollments_program_id ON enrollments("programId");
CREATE INDEX IF NOT EXISTS idx_analytics_events_user_id ON analytics_events("userId");
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON analytics_events("createdAt");
CREATE INDEX IF NOT EXISTS idx_video_progress_student_id ON video_progress("studentId");
CREATE INDEX IF NOT EXISTS idx_video_progress_session_id ON video_progress("sessionId");

-- Grant necessary permissions
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO kalpla_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO kalpla_user;

-- Log successful initialization
INSERT INTO analytics_events (id, event, properties, "createdAt") VALUES
('init_event', 'database_initialized', '{"version": "1.0", "timestamp": "' || NOW() || '"}', NOW())
ON CONFLICT (id) DO NOTHING;
