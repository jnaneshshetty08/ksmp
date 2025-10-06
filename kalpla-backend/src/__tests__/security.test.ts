import { SecurityValidator, apiSecurity } from '../utils/security';

describe('Security Validator', () => {
  describe('Email Validation', () => {
    it('should validate correct email addresses', () => {
      expect(SecurityValidator.isValidEmail('test@example.com')).toBe(true);
      expect(SecurityValidator.isValidEmail('user.name@domain.co.uk')).toBe(true);
      expect(SecurityValidator.isValidEmail('admin@kalpla.com')).toBe(true);
    });

    it('should reject invalid email addresses', () => {
      expect(SecurityValidator.isValidEmail('invalid-email')).toBe(false);
      expect(SecurityValidator.isValidEmail('test@')).toBe(false);
      expect(SecurityValidator.isValidEmail('@example.com')).toBe(false);
      expect(SecurityValidator.isValidEmail('test.example.com')).toBe(false);
    });
  });

  describe('Password Validation', () => {
    it('should validate strong passwords', () => {
      const result = SecurityValidator.validatePassword('StrongPass123!');
      expect(result.isValid).toBe(true);
      expect(result.score).toBeGreaterThanOrEqual(4);
      expect(result.feedback).toHaveLength(0);
    });

    it('should reject weak passwords', () => {
      const result = SecurityValidator.validatePassword('weak');
      expect(result.isValid).toBe(false);
      expect(result.score).toBeLessThan(4);
      expect(result.feedback.length).toBeGreaterThan(0);
    });

    it('should reject common passwords', () => {
      const result = SecurityValidator.validatePassword('password');
      expect(result.isValid).toBe(false);
      expect(result.feedback).toContain('Password is too common');
    });
  });

  describe('Phone Number Validation', () => {
    it('should validate correct phone numbers', () => {
      expect(SecurityValidator.isValidPhoneNumber('+1234567890')).toBe(true);
      expect(SecurityValidator.isValidPhoneNumber('123-456-7890')).toBe(true);
      expect(SecurityValidator.isValidPhoneNumber('(123) 456-7890')).toBe(true);
    });

    it('should reject invalid phone numbers', () => {
      expect(SecurityValidator.isValidPhoneNumber('123')).toBe(false);
      expect(SecurityValidator.isValidPhoneNumber('abc-def-ghij')).toBe(false);
      expect(SecurityValidator.isValidPhoneNumber('')).toBe(false);
    });
  });

  describe('URL Validation', () => {
    it('should validate correct URLs', () => {
      expect(SecurityValidator.isValidURL('https://example.com')).toBe(true);
      expect(SecurityValidator.isValidURL('http://localhost:3000')).toBe(true);
      expect(SecurityValidator.isValidURL('https://api.kalpla.com/v1/users')).toBe(true);
    });

    it('should reject invalid URLs', () => {
      expect(SecurityValidator.isValidURL('not-a-url')).toBe(false);
      expect(SecurityValidator.isValidURL('ftp://example.com')).toBe(false);
      expect(SecurityValidator.isValidURL('')).toBe(false);
    });
  });

  describe('Token Generation', () => {
    it('should generate secure tokens', () => {
      const token1 = SecurityValidator.generateSecureToken(32);
      const token2 = SecurityValidator.generateSecureToken(32);
      
      expect(token1).toHaveLength(64); // 32 bytes = 64 hex characters
      expect(token2).toHaveLength(64);
      expect(token1).not.toBe(token2);
    });

    it('should generate different tokens each time', () => {
      const tokens = Array.from({ length: 10 }, () => SecurityValidator.generateSecureToken(16));
      const uniqueTokens = new Set(tokens);
      expect(uniqueTokens.size).toBe(10);
    });
  });

  describe('JWT Validation', () => {
    it('should validate correct JWT format', () => {
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
      expect(SecurityValidator.isValidJWTFormat(token)).toBe(true);
    });

    it('should reject invalid JWT format', () => {
      expect(SecurityValidator.isValidJWTFormat('invalid-token')).toBe(false);
      expect(SecurityValidator.isValidJWTFormat('header.payload')).toBe(false);
      expect(SecurityValidator.isValidJWTFormat('')).toBe(false);
    });
  });

  describe('XSS Detection', () => {
    it('should detect XSS patterns', () => {
      expect(SecurityValidator.detectXSS('<script>alert("xss")</script>')).toBe(true);
      expect(SecurityValidator.detectXSS('javascript:alert("xss")')).toBe(true);
      expect(SecurityValidator.detectXSS('<img onerror="alert(\'xss\')" src="x">')).toBe(true);
      expect(SecurityValidator.detectXSS('<iframe src="javascript:alert(\'xss\')"></iframe>')).toBe(true);
    });

    it('should not detect false positives', () => {
      expect(SecurityValidator.detectXSS('Hello world')).toBe(false);
      expect(SecurityValidator.detectXSS('This is a normal text')).toBe(false);
      expect(SecurityValidator.detectXSS('user@example.com')).toBe(false);
    });
  });

  describe('SQL Injection Detection', () => {
    it('should detect SQL injection patterns', () => {
      expect(SecurityValidator.detectSQLInjection("'; DROP TABLE users; --")).toBe(true);
      expect(SecurityValidator.detectSQLInjection("1' OR '1'='1")).toBe(true);
      expect(SecurityValidator.detectSQLInjection("UNION SELECT * FROM users")).toBe(true);
      expect(SecurityValidator.detectSQLInjection("admin'--")).toBe(true);
    });

    it('should not detect false positives', () => {
      expect(SecurityValidator.detectSQLInjection('SELECT * FROM users')).toBe(false);
      expect(SecurityValidator.detectSQLInjection('Hello world')).toBe(false);
      expect(SecurityValidator.detectSQLInjection('user@example.com')).toBe(false);
    });
  });

  describe('Rate Limiting', () => {
    it('should enforce rate limits', () => {
      const rateLimiter = SecurityValidator.createRateLimiter(3, 1000); // 3 requests per second
      
      expect(rateLimiter('user1')).toBe(true);
      expect(rateLimiter('user1')).toBe(true);
      expect(rateLimiter('user1')).toBe(true);
      expect(rateLimiter('user1')).toBe(false); // Should be rate limited
    });

    it('should allow requests after window expires', (done) => {
      const rateLimiter = SecurityValidator.createRateLimiter(1, 100); // 1 request per 100ms
      
      expect(rateLimiter('user1')).toBe(true);
      expect(rateLimiter('user1')).toBe(false);
      
      setTimeout(() => {
        expect(rateLimiter('user1')).toBe(true);
        done();
      }, 150);
    });
  });

  describe('Password Hashing', () => {
    it('should hash passwords correctly', async () => {
      const password = 'testpassword123';
      const hash = await SecurityValidator.hashPassword(password);
      
      expect(hash).toBeDefined();
      expect(hash).not.toBe(password);
      expect(hash.length).toBeGreaterThan(50);
    });

    it('should verify passwords correctly', async () => {
      const password = 'testpassword123';
      const hash = await SecurityValidator.hashPassword(password);
      
      expect(await SecurityValidator.comparePassword(password, hash)).toBe(true);
      expect(await SecurityValidator.comparePassword('wrongpassword', hash)).toBe(false);
    });
  });

  describe('JWT Token Generation and Verification', () => {
    it('should generate and verify JWT tokens', () => {
      const payload = { userId: '123', role: 'admin' };
      const token = SecurityValidator.generateJWT(payload);
      
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      
      const decoded = SecurityValidator.verifyJWT(token);
      expect(decoded.userId).toBe('123');
      expect(decoded.role).toBe('admin');
    });

    it('should reject invalid JWT tokens', () => {
      expect(() => {
        SecurityValidator.verifyJWT('invalid-token');
      }).toThrow('Invalid token');
    });
  });

  describe('API Key Validation', () => {
    it('should validate API key format', () => {
      const validApiKey = SecurityValidator.generateApiKey();
      expect(SecurityValidator.validateApiKey(validApiKey)).toBe(true);
      expect(SecurityValidator.validateApiKey('short')).toBe(false);
      expect(SecurityValidator.validateApiKey('invalid-characters!')).toBe(false);
    });

    it('should generate valid API keys', () => {
      const apiKey = SecurityValidator.generateApiKey();
      expect(apiKey).toHaveLength(64);
      expect(SecurityValidator.validateApiKey(apiKey)).toBe(true);
    });
  });

  describe('File Security', () => {
    it('should validate file types', () => {
      expect(SecurityValidator.validateFileType('image.jpg', ['jpg', 'png', 'gif'])).toBe(true);
      expect(SecurityValidator.validateFileType('document.pdf', ['pdf', 'doc', 'docx'])).toBe(true);
      expect(SecurityValidator.validateFileType('script.exe', ['jpg', 'png', 'gif'])).toBe(false);
    });

    it('should detect malicious files', () => {
      expect(SecurityValidator.isMaliciousFile('script.exe')).toBe(true);
      expect(SecurityValidator.isMaliciousFile('malware.bat')).toBe(true);
      expect(SecurityValidator.isMaliciousFile('image.jpg')).toBe(false);
      expect(SecurityValidator.isMaliciousFile('document.pdf')).toBe(false);
    });

    it('should sanitize filenames', () => {
      expect(SecurityValidator.sanitizeFilename('My File (1).jpg')).toBe('my_file_1_.jpg');
      expect(SecurityValidator.sanitizeFilename('script.exe')).toBe('script.exe');
      expect(SecurityValidator.sanitizeFilename('file with spaces.txt')).toBe('file_with_spaces.txt');
    });
  });

  describe('IP Address Validation', () => {
    it('should validate IPv4 addresses', () => {
      expect(SecurityValidator.isValidIP('192.168.1.1')).toBe(true);
      expect(SecurityValidator.isValidIP('127.0.0.1')).toBe(true);
      expect(SecurityValidator.isValidIP('255.255.255.255')).toBe(true);
      expect(SecurityValidator.isValidIP('256.256.256.256')).toBe(false);
      expect(SecurityValidator.isValidIP('192.168.1')).toBe(false);
    });

    it('should validate IPv6 addresses', () => {
      expect(SecurityValidator.isValidIP('2001:0db8:85a3:0000:0000:8a2e:0370:7334')).toBe(true);
      expect(SecurityValidator.isValidIP('::1')).toBe(false); // Simplified format not supported
    });
  });

  describe('UUID Validation', () => {
    it('should validate UUIDs', () => {
      expect(SecurityValidator.isValidUUID('550e8400-e29b-41d4-a716-446655440000')).toBe(true);
      expect(SecurityValidator.isValidUUID('6ba7b810-9dad-11d1-80b4-00c04fd430c8')).toBe(true);
      expect(SecurityValidator.isValidUUID('invalid-uuid')).toBe(false);
      expect(SecurityValidator.isValidUUID('550e8400-e29b-41d4-a716')).toBe(false);
    });
  });

  describe('ObjectId Validation', () => {
    it('should validate MongoDB ObjectIds', () => {
      expect(SecurityValidator.isValidObjectId('507f1f77bcf86cd799439011')).toBe(true);
      expect(SecurityValidator.isValidObjectId('507f1f77bcf86cd799439012')).toBe(true);
      expect(SecurityValidator.isValidObjectId('invalid-objectid')).toBe(false);
      expect(SecurityValidator.isValidObjectId('507f1f77bcf86cd79943901')).toBe(false); // Too short
    });
  });

  describe('Input Sanitization', () => {
    it('should sanitize malicious input', () => {
      const maliciousInput = '<script>alert("xss")</script>Hello';
      const sanitized = SecurityValidator.sanitizeInput(maliciousInput);
      expect(sanitized).not.toContain('<script>');
      expect(sanitized).toContain('Hello');
    });

    it('should preserve safe input', () => {
      const safeInput = 'Hello world!';
      const sanitized = SecurityValidator.sanitizeInput(safeInput);
      expect(sanitized).toBe('Hello world!');
    });
  });

  describe('Suspicious Pattern Detection', () => {
    it('should detect suspicious patterns', () => {
      expect(SecurityValidator.detectSuspiciousPatterns('../../../etc/passwd')).toBe(true);
      expect(SecurityValidator.detectSuspiciousPatterns('<script>alert("xss")</script>')).toBe(true);
      expect(SecurityValidator.detectSuspiciousPatterns("'; DROP TABLE users; --")).toBe(true);
      expect(SecurityValidator.detectSuspiciousPatterns('Hello world')).toBe(false);
    });
  });

  describe('Environment Validation', () => {
    it('should validate environment variables', () => {
      // Mock environment variables
      process.env.JWT_SECRET = 'a'.repeat(32);
      process.env.DATABASE_URL = 'postgresql://localhost:5432/test';
      process.env.NODE_ENV = 'test';

      const result = SecurityValidator.validateEnvironment();
      expect(result.isValid).toBe(true);
      expect(result.missing).toHaveLength(0);
      expect(result.invalid).toHaveLength(0);
    });

    it('should detect missing environment variables', () => {
      // Clear environment variables
      delete process.env.JWT_SECRET;
      delete process.env.DATABASE_URL;
      delete process.env.NODE_ENV;

      const result = SecurityValidator.validateEnvironment();
      expect(result.isValid).toBe(false);
      expect(result.missing.length).toBeGreaterThan(0);
    });
  });
});

describe('API Security', () => {
  describe('API Key Validation', () => {
    it('should validate API key format', () => {
      expect(apiSecurity.validateApiKey('a'.repeat(32))).toBe(true);
      expect(apiSecurity.validateApiKey('short')).toBe(false);
      expect(apiSecurity.validateApiKey('invalid-characters!')).toBe(false);
    });

    it('should generate valid API keys', () => {
      const apiKey = apiSecurity.generateApiKey();
      expect(apiKey).toHaveLength(64);
      expect(apiSecurity.validateApiKey(apiKey)).toBe(true);
    });
  });

  describe('Origin Validation', () => {
    it('should validate allowed origins', () => {
      const allowedOrigins = ['https://kalpla.com', 'https://app.kalpla.com'];
      expect(apiSecurity.validateOrigin('https://kalpla.com', allowedOrigins)).toBe(true);
      expect(apiSecurity.validateOrigin('https://app.kalpla.com', allowedOrigins)).toBe(true);
      expect(apiSecurity.validateOrigin('https://malicious.com', allowedOrigins)).toBe(false);
    });
  });

  describe('Suspicious Request Detection', () => {
    it('should detect suspicious requests', () => {
      const suspiciousRequest = {
        method: 'GET',
        path: '../../../etc/passwd',
        headers: { 'user-agent': 'Mozilla/5.0' },
        body: '<script>alert("xss")</script>'
      };

      expect(apiSecurity.detectSuspiciousRequest(suspiciousRequest)).toBe(true);
    });

    it('should not detect normal requests', () => {
      const normalRequest = {
        method: 'GET',
        path: '/api/users',
        headers: { 'user-agent': 'Mozilla/5.0' },
        body: JSON.stringify({ name: 'John Doe' })
      };

      expect(apiSecurity.detectSuspiciousRequest(normalRequest)).toBe(false);
    });
  });
});
