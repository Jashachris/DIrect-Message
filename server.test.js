const request = require('supertest');
const app = require('./server');
const fs = require('fs');
const path = require('path');

describe('Direct Message API', () => {
  let userId1, userId2;

  // Create test users before running tests
  beforeAll(async () => {
    const user1 = await request(app)
      .post('/api/users')
      .send({ username: 'testuser1' });
    userId1 = user1.body.user.id;

    const user2 = await request(app)
      .post('/api/users')
      .send({ username: 'testuser2' });
    userId2 = user2.body.user.id;
  });

  describe('GET /api/health', () => {
    it('should return ok status', async () => {
      const res = await request(app).get('/api/health');
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('ok');
    });
  });

  describe('POST /api/users', () => {
    it('should create a new user', async () => {
      const res = await request(app)
        .post('/api/users')
        .send({ username: 'newuser' });
      
      expect(res.statusCode).toBe(201);
      expect(res.body.user).toHaveProperty('id');
      expect(res.body.user.username).toBe('newuser');
    });

    it('should return error when username is missing', async () => {
      const res = await request(app)
        .post('/api/users')
        .send({});
      
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBeDefined();
    });

    it('should return error for duplicate username', async () => {
      await request(app)
        .post('/api/users')
        .send({ username: 'duplicate' });
      
      const res = await request(app)
        .post('/api/users')
        .send({ username: 'duplicate' });
      
      expect(res.statusCode).toBe(400);
    });
  });

  describe('GET /api/users', () => {
    it('should return all users', async () => {
      const res = await request(app).get('/api/users');
      
      expect(res.statusCode).toBe(200);
      expect(res.body.users).toBeDefined();
      expect(Array.isArray(res.body.users)).toBe(true);
    });
  });

  describe('GET /api/users/:id', () => {
    it('should return a specific user', async () => {
      const res = await request(app).get(`/api/users/${userId1}`);
      
      expect(res.statusCode).toBe(200);
      expect(res.body.user).toBeDefined();
      expect(res.body.user.id).toBe(userId1);
    });

    it('should return 404 for non-existent user', async () => {
      const res = await request(app).get('/api/users/99999');
      
      expect(res.statusCode).toBe(404);
    });
  });

  describe('POST /api/users/:id/upload-image', () => {
    it('should upload profile image successfully', async () => {
      // Create a test image file
      const testImagePath = path.join(__dirname, 'test-image.png');
      const testImageBuffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64');
      fs.writeFileSync(testImagePath, testImageBuffer);

      const res = await request(app)
        .post(`/api/users/${userId1}/upload-image`)
        .attach('profileImage', testImagePath);

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe('Profile image uploaded successfully');
      expect(res.body.imagePath).toBeDefined();
      expect(res.body.imagePath).toContain('/uploads/');

      // Cleanup
      fs.unlinkSync(testImagePath);
    });

    it('should return error when no file is uploaded', async () => {
      const res = await request(app)
        .post(`/api/users/${userId1}/upload-image`);

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe('No file uploaded');
    });

    it('should return error for non-existent user', async () => {
      const testImagePath = path.join(__dirname, 'test-image.png');
      const testImageBuffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64');
      fs.writeFileSync(testImagePath, testImageBuffer);

      const res = await request(app)
        .post('/api/users/99999/upload-image')
        .attach('profileImage', testImagePath);

      expect(res.statusCode).toBe(404);

      // Cleanup
      fs.unlinkSync(testImagePath);
    });
  });

  describe('POST /api/messages', () => {
    it('should send a message successfully', async () => {
      const res = await request(app)
        .post('/api/messages')
        .send({
          sender_id: userId1,
          receiver_id: userId2,
          message: 'Hello, this is a test message'
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.message).toBe('Message sent successfully');
      expect(res.body.id).toBeDefined();
    });

    it('should return error when required fields are missing', async () => {
      const res = await request(app)
        .post('/api/messages')
        .send({
          sender_id: userId1
        });

      expect(res.statusCode).toBe(400);
    });
  });

  describe('GET /api/messages/:userId1/:userId2', () => {
    it('should return messages between two users', async () => {
      const res = await request(app)
        .get(`/api/messages/${userId1}/${userId2}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.messages).toBeDefined();
      expect(Array.isArray(res.body.messages)).toBe(true);
    });

    it('should include sender and receiver information', async () => {
      // Send a message first
      await request(app)
        .post('/api/messages')
        .send({
          sender_id: userId1,
          receiver_id: userId2,
          message: 'Test message for retrieval'
        });

      const res = await request(app)
        .get(`/api/messages/${userId1}/${userId2}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.messages.length).toBeGreaterThan(0);
      expect(res.body.messages[0]).toHaveProperty('sender_username');
      expect(res.body.messages[0]).toHaveProperty('receiver_username');
    });
  });
});
