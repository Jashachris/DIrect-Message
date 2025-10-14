const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/server');
const User = require('../src/models/User');
const Message = require('../src/models/Message');

describe('Message Tests', () => {
  let token1, token2, user1Id, user2Id;

  beforeAll(async () => {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/direct-message-test';
    await mongoose.connect(mongoURI);
  });

  afterAll(async () => {
    await User.deleteMany({});
    await Message.deleteMany({});
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await User.deleteMany({});
    await Message.deleteMany({});

    // Create two test users
    const response1 = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'user1',
        email: 'user1@example.com',
        password: 'password123'
      });
    token1 = response1.body.token;
    user1Id = response1.body.user.id;

    const response2 = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'user2',
        email: 'user2@example.com',
        password: 'password123'
      });
    token2 = response2.body.token;
    user2Id = response2.body.user.id;
  });

  describe('POST /api/messages', () => {
    it('should send a message', async () => {
      const response = await request(app)
        .post('/api/messages')
        .set('Authorization', `Bearer ${token1}`)
        .send({
          recipientId: user2Id,
          content: 'Hello, this is a test message'
        });

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('Message sent successfully');
      expect(response.body.data.content).toBe('Hello, this is a test message');
    });

    it('should not send message without authentication', async () => {
      const response = await request(app)
        .post('/api/messages')
        .send({
          recipientId: user2Id,
          content: 'Hello'
        });

      expect(response.status).toBe(401);
    });

    it('should not send empty message', async () => {
      const response = await request(app)
        .post('/api/messages')
        .set('Authorization', `Bearer ${token1}`)
        .send({
          recipientId: user2Id,
          content: '   '
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('empty');
    });

    it('should not send message to yourself', async () => {
      const response = await request(app)
        .post('/api/messages')
        .set('Authorization', `Bearer ${token1}`)
        .send({
          recipientId: user1Id,
          content: 'Hello to myself'
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('yourself');
    });
  });

  describe('GET /api/messages/conversation/:userId', () => {
    beforeEach(async () => {
      // Send some messages
      await request(app)
        .post('/api/messages')
        .set('Authorization', `Bearer ${token1}`)
        .send({
          recipientId: user2Id,
          content: 'Message 1 from user1'
        });

      await request(app)
        .post('/api/messages')
        .set('Authorization', `Bearer ${token2}`)
        .send({
          recipientId: user1Id,
          content: 'Message 2 from user2'
        });
    });

    it('should get conversation between two users', async () => {
      const response = await request(app)
        .get(`/api/messages/conversation/${user2Id}`)
        .set('Authorization', `Bearer ${token1}`);

      expect(response.status).toBe(200);
      expect(response.body.messages).toHaveLength(2);
    });

    it('should not get conversation without authentication', async () => {
      const response = await request(app)
        .get(`/api/messages/conversation/${user2Id}`);

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/messages/users', () => {
    it('should get list of all users except self', async () => {
      const response = await request(app)
        .get('/api/messages/users')
        .set('Authorization', `Bearer ${token1}`);

      expect(response.status).toBe(200);
      expect(response.body.users).toHaveLength(1);
      expect(response.body.users[0].username).toBe('user2');
    });

    it('should not get users without authentication', async () => {
      const response = await request(app)
        .get('/api/messages/users');

      expect(response.status).toBe(401);
    });
  });
});
