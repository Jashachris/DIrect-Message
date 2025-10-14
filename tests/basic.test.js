const request = require('supertest');
const app = require('../src/server');

describe('Basic Server Tests', () => {
  describe('GET /api/health', () => {
    it('should return health check status', async () => {
      const response = await request(app).get('/api/health');
      
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('ok');
      expect(response.body.message).toBe('Server is running');
    });
  });

  describe('Authentication required', () => {
    it('should require authentication for protected routes', async () => {
      const response = await request(app).get('/api/auth/profile');
      
      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Authentication required');
    });

    it('should require authentication for message routes', async () => {
      const response = await request(app).get('/api/messages/users');
      
      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Authentication required');
    });
  });

  describe('Rate limiting', () => {
    it('should have rate limiting on API routes', async () => {
      const response = await request(app).get('/api/health');
      
      // Check for rate limit headers
      expect(response.headers).toHaveProperty('ratelimit-limit');
      expect(response.headers).toHaveProperty('ratelimit-remaining');
    });
  });
});
