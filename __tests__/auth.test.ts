import request from 'supertest';
import app from '../src/app';
import sequelize from '../src/config/db.config';
import User from '../src/models/user.models';

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe('Auth API', () => {
  const testUser = {
    username: 'testuser',
    email: 'test@example.com',
    password: 'password123',
  };

  describe('POST /v1/auth/register', () => {
    it('should register a new user', async () => {
      const response = await request(app)
        .post('/v1/auth/register')
        .send(testUser);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.user).toHaveProperty('id');
      expect(response.body.data.user.email).toBe(testUser.email);
    });

    it('should fail with duplicate email', async () => {
      const response = await request(app)
        .post('/v1/auth/register')
        .send(testUser);

      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /v1/auth/login', () => {
    it('should login with correct credentials', async () => {
      // Mark user as verified
      await User.update(
        { isVerified: true },
        { where: { email: testUser.email } }
      );

      const response = await request(app).post('/v1/auth/login').send({
        email: testUser.email,
        password: testUser.password,
      });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('accessToken');
    });

    it('should fail with incorrect password', async () => {
      const response = await request(app).post('/v1/auth/login').send({
        email: testUser.email,
        password: 'wrongpassword',
      });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });
});
