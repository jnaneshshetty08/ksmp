import request from 'supertest'
import { app } from '../../server'
import { mockPrisma } from '../../../jest.setup'

describe('Auth Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('POST /api/auth/login', () => {
    it('should login successfully with valid credentials', async () => {
      const mockUser = {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        role: 'admin',
        password: 'hashed_password',
      }

      mockPrisma.user.findUnique.mockResolvedValue(mockUser)

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123',
        })

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.user).toMatchObject({
        id: mockUser.id,
        name: mockUser.name,
        email: mockUser.email,
        role: mockUser.role,
      })
      expect(response.body.token).toBeDefined()
    })

    it('should return error for invalid email', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null)

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123',
        })

      expect(response.status).toBe(401)
      expect(response.body.success).toBe(false)
      expect(response.body.error).toBe('Invalid credentials')
    })

    it('should return error for invalid password', async () => {
      const mockUser = {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        role: 'admin',
        password: 'hashed_password',
      }

      mockPrisma.user.findUnique.mockResolvedValue(mockUser)

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword',
        })

      expect(response.status).toBe(401)
      expect(response.body.success).toBe(false)
      expect(response.body.error).toBe('Invalid credentials')
    })

    it('should return error for missing fields', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
        })

      expect(response.status).toBe(400)
      expect(response.body.success).toBe(false)
      expect(response.body.error).toContain('Password is required')
    })

    it('should handle database errors', async () => {
      mockPrisma.user.findUnique.mockRejectedValue(new Error('Database error'))

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123',
        })

      expect(response.status).toBe(500)
      expect(response.body.success).toBe(false)
      expect(response.body.error).toBe('Internal server error')
    })
  })

  describe('POST /api/auth/register', () => {
    it('should register user successfully', async () => {
      const mockUser = {
        id: '1',
        name: 'New User',
        email: 'newuser@example.com',
        role: 'student',
      }

      mockPrisma.user.findUnique.mockResolvedValue(null)
      mockPrisma.user.create.mockResolvedValue(mockUser)

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'New User',
          email: 'newuser@example.com',
          password: 'password123',
          role: 'student',
        })

      expect(response.status).toBe(201)
      expect(response.body.success).toBe(true)
      expect(response.body.user).toMatchObject({
        id: mockUser.id,
        name: mockUser.name,
        email: mockUser.email,
        role: mockUser.role,
      })
    })

    it('should return error for existing email', async () => {
      const existingUser = {
        id: '1',
        name: 'Existing User',
        email: 'existing@example.com',
        role: 'student',
      }

      mockPrisma.user.findUnique.mockResolvedValue(existingUser)

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'New User',
          email: 'existing@example.com',
          password: 'password123',
          role: 'student',
        })

      expect(response.status).toBe(400)
      expect(response.body.success).toBe(false)
      expect(response.body.error).toBe('User already exists')
    })

    it('should return error for invalid role', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'New User',
          email: 'newuser@example.com',
          password: 'password123',
          role: 'invalid_role',
        })

      expect(response.status).toBe(400)
      expect(response.body.success).toBe(false)
      expect(response.body.error).toContain('Invalid role')
    })
  })

  describe('POST /api/auth/logout', () => {
    it('should logout successfully', async () => {
      const response = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', 'Bearer mock-jwt-token')

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.message).toBe('Logged out successfully')
    })
  })

  describe('GET /api/auth/me', () => {
    it('should return user profile for authenticated user', async () => {
      const mockUser = {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        role: 'admin',
      }

      mockPrisma.user.findUnique.mockResolvedValue(mockUser)

      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer mock-jwt-token')

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.user).toMatchObject(mockUser)
    })

    it('should return error for unauthenticated user', async () => {
      const response = await request(app)
        .get('/api/auth/me')

      expect(response.status).toBe(401)
      expect(response.body.success).toBe(false)
      expect(response.body.error).toBe('No token provided')
    })

    it('should return error for invalid token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid-token')

      expect(response.status).toBe(401)
      expect(response.body.success).toBe(false)
      expect(response.body.error).toBe('Invalid token')
    })
  })

  describe('POST /api/auth/forgot-password', () => {
    it('should send reset email for existing user', async () => {
      const mockUser = {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        role: 'student',
      }

      mockPrisma.user.findUnique.mockResolvedValue(mockUser)
      mockPrisma.user.update.mockResolvedValue(mockUser)

      const response = await request(app)
        .post('/api/auth/forgot-password')
        .send({
          email: 'test@example.com',
        })

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.message).toBe('Password reset email sent')
    })

    it('should return success even for non-existing user (security)', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null)

      const response = await request(app)
        .post('/api/auth/forgot-password')
        .send({
          email: 'nonexistent@example.com',
        })

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.message).toBe('Password reset email sent')
    })
  })

  describe('POST /api/auth/reset-password', () => {
    it('should reset password successfully', async () => {
      const mockUser = {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        role: 'student',
        resetPasswordToken: 'valid-token',
        resetPasswordExpires: new Date(Date.now() + 3600000), // 1 hour from now
      }

      mockPrisma.user.findUnique.mockResolvedValue(mockUser)
      mockPrisma.user.update.mockResolvedValue(mockUser)

      const response = await request(app)
        .post('/api/auth/reset-password')
        .send({
          token: 'valid-token',
          password: 'newpassword123',
        })

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.message).toBe('Password reset successfully')
    })

    it('should return error for invalid token', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null)

      const response = await request(app)
        .post('/api/auth/reset-password')
        .send({
          token: 'invalid-token',
          password: 'newpassword123',
        })

      expect(response.status).toBe(400)
      expect(response.body.success).toBe(false)
      expect(response.body.error).toBe('Invalid or expired token')
    })

    it('should return error for expired token', async () => {
      const mockUser = {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        role: 'student',
        resetPasswordToken: 'expired-token',
        resetPasswordExpires: new Date(Date.now() - 3600000), // 1 hour ago
      }

      mockPrisma.user.findUnique.mockResolvedValue(mockUser)

      const response = await request(app)
        .post('/api/auth/reset-password')
        .send({
          token: 'expired-token',
          password: 'newpassword123',
        })

      expect(response.status).toBe(400)
      expect(response.body.success).toBe(false)
      expect(response.body.error).toBe('Invalid or expired token')
    })
  })
})
