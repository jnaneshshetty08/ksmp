import request from 'supertest'
import { app } from '../../server'
import { mockPrisma } from '../../../jest.setup'

describe('Admin Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET /api/admin/analytics/overview', () => {
    it('should return analytics overview for admin', async () => {
      const mockAnalytics = {
        users: {
          students: 100,
          mentors: 10,
        },
        content: {
          completionRate: 75.5,
        },
      }

      mockPrisma.user.count
        .mockResolvedValueOnce(100) // students
        .mockResolvedValueOnce(10) // mentors
      
      mockPrisma.session.count.mockResolvedValue(50)
      mockPrisma.videoProgress.count.mockResolvedValue(200)

      const response = await request(app)
        .get('/api/admin/analytics/overview')
        .set('Authorization', 'Bearer mock-jwt-token')

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.data).toHaveProperty('users')
      expect(response.body.data).toHaveProperty('content')
    })

    it('should return error for non-admin user', async () => {
      // Mock JWT to return student role
      const jwt = require('jsonwebtoken')
      jwt.verify.mockReturnValueOnce({ id: '1', email: 'student@example.com', role: 'student' })

      const response = await request(app)
        .get('/api/admin/analytics/overview')
        .set('Authorization', 'Bearer mock-jwt-token')

      expect(response.status).toBe(403)
      expect(response.body.success).toBe(false)
      expect(response.body.error).toBe('Access denied')
    })
  })

  describe('GET /api/admin/users', () => {
    it('should return all users for admin', async () => {
      const mockUsers = [
        {
          id: '1',
          name: 'User 1',
          email: 'user1@example.com',
          role: 'student',
        },
        {
          id: '2',
          name: 'User 2',
          email: 'user2@example.com',
          role: 'mentor',
        },
      ]

      mockPrisma.user.findMany.mockResolvedValue(mockUsers)

      const response = await request(app)
        .get('/api/admin/users')
        .set('Authorization', 'Bearer mock-jwt-token')

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.data).toHaveLength(2)
      expect(response.body.data[0]).toMatchObject(mockUsers[0])
    })

    it('should filter users by role', async () => {
      const mockStudents = [
        {
          id: '1',
          name: 'Student 1',
          email: 'student1@example.com',
          role: 'student',
        },
      ]

      mockPrisma.user.findMany.mockResolvedValue(mockStudents)

      const response = await request(app)
        .get('/api/admin/users?role=student')
        .set('Authorization', 'Bearer mock-jwt-token')

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.data).toHaveLength(1)
      expect(response.body.data[0].role).toBe('student')
    })
  })

  describe('GET /api/admin/programs', () => {
    it('should return all programs with modules and sessions', async () => {
      const mockPrograms = [
        {
          id: '1',
          name: 'Test Program',
          description: 'Test Description',
          modules: [
            {
              id: '1',
              title: 'Module 1',
              sessions: [
                {
                  id: '1',
                  title: 'Session 1',
                  creator: {
                    name: 'Mentor 1',
                    email: 'mentor1@example.com',
                  },
                },
              ],
            },
          ],
          _count: {
            enrollments: 10,
          },
        },
      ]

      mockPrisma.program.findMany.mockResolvedValue(mockPrograms)

      const response = await request(app)
        .get('/api/admin/programs')
        .set('Authorization', 'Bearer mock-jwt-token')

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.data).toHaveLength(1)
      expect(response.body.data[0]).toHaveProperty('modules')
      expect(response.body.data[0]).toHaveProperty('_count')
    })
  })

  describe('POST /api/admin/programs', () => {
    it('should create new program successfully', async () => {
      const newProgram = {
        id: '1',
        name: 'New Program',
        description: 'New Description',
        price: 9999,
        duration: 12,
      }

      mockPrisma.program.create.mockResolvedValue(newProgram)

      const response = await request(app)
        .post('/api/admin/programs')
        .set('Authorization', 'Bearer mock-jwt-token')
        .send({
          name: 'New Program',
          description: 'New Description',
          price: 9999,
          duration: 12,
        })

      expect(response.status).toBe(201)
      expect(response.body.success).toBe(true)
      expect(response.body.data).toMatchObject(newProgram)
    })

    it('should return error for missing required fields', async () => {
      const response = await request(app)
        .post('/api/admin/programs')
        .set('Authorization', 'Bearer mock-jwt-token')
        .send({
          name: 'New Program',
          // Missing description
        })

      expect(response.status).toBe(400)
      expect(response.body.success).toBe(false)
      expect(response.body.error).toContain('Description is required')
    })
  })

  describe('GET /api/admin/mentors', () => {
    it('should return all mentors with statistics', async () => {
      const mockMentors = [
        {
          id: '1',
          name: 'Mentor 1',
          email: 'mentor1@example.com',
          sessions: [
            {
              id: '1',
              title: 'Session 1',
            },
          ],
          _count: {
            sessions: 5,
            students: 20,
          },
        },
      ]

      mockPrisma.user.findMany.mockResolvedValue(mockMentors)

      const response = await request(app)
        .get('/api/admin/mentors')
        .set('Authorization', 'Bearer mock-jwt-token')

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.data).toHaveLength(1)
      expect(response.body.data[0]).toHaveProperty('_count')
    })
  })

  describe('GET /api/admin/mentors/applications', () => {
    it('should return all mentor applications', async () => {
      const mockApplications = [
        {
          id: '1',
          status: 'pending',
          user: {
            name: 'Applicant 1',
            email: 'applicant1@example.com',
          },
          experience: '5 years',
          qualifications: 'MBA',
        },
      ]

      mockPrisma.mentorApplication.findMany.mockResolvedValue(mockApplications)

      const response = await request(app)
        .get('/api/admin/mentors/applications')
        .set('Authorization', 'Bearer mock-jwt-token')

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.data).toHaveLength(1)
      expect(response.body.data[0].status).toBe('pending')
    })
  })

  describe('PUT /api/admin/mentors/applications/:id', () => {
    it('should approve mentor application', async () => {
      const mockApplication = {
        id: '1',
        status: 'approved',
        user: {
          name: 'Applicant 1',
          email: 'applicant1@example.com',
        },
      }

      mockPrisma.mentorApplication.findUnique.mockResolvedValue(mockApplication)
      mockPrisma.mentorApplication.update.mockResolvedValue(mockApplication)
      mockPrisma.user.update.mockResolvedValue({
        id: '1',
        role: 'mentor',
      })

      const response = await request(app)
        .put('/api/admin/mentors/applications/1')
        .set('Authorization', 'Bearer mock-jwt-token')
        .send({
          status: 'approved',
        })

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.data.status).toBe('approved')
    })

    it('should return error for non-existent application', async () => {
      mockPrisma.mentorApplication.findUnique.mockResolvedValue(null)

      const response = await request(app)
        .put('/api/admin/mentors/applications/999')
        .set('Authorization', 'Bearer mock-jwt-token')
        .send({
          status: 'approved',
        })

      expect(response.status).toBe(404)
      expect(response.body.success).toBe(false)
      expect(response.body.error).toBe('Application not found')
    })
  })

  describe('GET /api/admin/students', () => {
    it('should return all students with enrollment data', async () => {
      const mockStudents = [
        {
          id: '1',
          name: 'Student 1',
          email: 'student1@example.com',
          enrollments: [
            {
              program: {
                name: 'Program 1',
              },
            },
          ],
          videoProgress: [
            {
              completed: true,
            },
          ],
        },
      ]

      mockPrisma.user.findMany.mockResolvedValue(mockStudents)

      const response = await request(app)
        .get('/api/admin/students')
        .set('Authorization', 'Bearer mock-jwt-token')

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.data).toHaveLength(1)
      expect(response.body.data[0]).toHaveProperty('enrollments')
      expect(response.body.data[0]).toHaveProperty('videoProgress')
    })
  })

  describe('GET /api/admin/payments', () => {
    it('should return all payment transactions', async () => {
      const mockPayments = [
        {
          id: '1',
          amount: 9999,
          status: 'completed',
          student: {
            name: 'Student 1',
            email: 'student1@example.com',
          },
          program: {
            name: 'Program 1',
          },
        },
      ]

      mockPrisma.payment.findMany.mockResolvedValue(mockPayments)

      const response = await request(app)
        .get('/api/admin/payments')
        .set('Authorization', 'Bearer mock-jwt-token')

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.data).toHaveLength(1)
      expect(response.body.data[0].status).toBe('completed')
    })
  })

  describe('PUT /api/admin/users/:id/status', () => {
    it('should update user status successfully', async () => {
      const mockUser = {
        id: '1',
        name: 'User 1',
        email: 'user1@example.com',
        status: 'active',
      }

      mockPrisma.user.findUnique.mockResolvedValue(mockUser)
      mockPrisma.user.update.mockResolvedValue({
        ...mockUser,
        status: 'inactive',
      })

      const response = await request(app)
        .put('/api/admin/users/1/status')
        .set('Authorization', 'Bearer mock-jwt-token')
        .send({
          status: 'inactive',
        })

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.data.status).toBe('inactive')
    })

    it('should return error for invalid status', async () => {
      const response = await request(app)
        .put('/api/admin/users/1/status')
        .set('Authorization', 'Bearer mock-jwt-token')
        .send({
          status: 'invalid_status',
        })

      expect(response.status).toBe(400)
      expect(response.body.success).toBe(false)
      expect(response.body.error).toContain('Invalid status')
    })
  })
})
