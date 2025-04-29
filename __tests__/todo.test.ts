import request from 'supertest';
import app from '../src/app';
import Todo from '../src/models/todo.models';
import User from '../src/models/user.models';

let authToken: string;
let userId: number;

beforeAll(async () => {
  // Create a test user and get auth token
  const testUser = await User.create({
    username: 'todotestuser',
    email: 'todo@example.com',
    password: 'password123',
    isVerified: true,
  });

  userId = testUser.id;

  const loginResponse = await request(app).post('/v1/auth/login').send({
    email: 'todo@example.com',
    password: 'password123',
  });

  authToken = loginResponse.body.data.accessToken;
});

afterAll(async () => {
  await Todo.destroy({ where: {} });
  await User.destroy({ where: {} });
});

describe('Todo API', () => {
  describe('POST /v1/todos', () => {
    it('should create a new todo', async () => {
      const response = await request(app)
        .post('/v1/todos')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Test Todo',
          description: 'Test Description',
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.title).toBe('Test Todo');
    });
  });

  describe('GET /v1/todos', () => {
    it('should get all todos for the user', async () => {
      const response = await request(app)
        .get('/v1/todos')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('GET /v1/todos/:id', () => {
    it('should get a specific todo', async () => {
      const todo = await Todo.create({
        userId,
        title: 'Specific Todo',
        description: 'Specific Description',
      });

      const response = await request(app)
        .get(`/v1/todos/${todo.id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(todo.id);
    });
  });

  describe('PUT /v1/todos/:id', () => {
    it('should update a todo', async () => {
      const todo = await Todo.create({
        userId,
        title: 'Update Todo',
        description: 'Update Description',
      });

      const response = await request(app)
        .put(`/v1/todos/${todo.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Updated Todo Title',
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe('Updated Todo Title');
    });
  });

  describe('DELETE /v1/todos/:id', () => {
    it('should delete a todo', async () => {
      const todo = await Todo.create({
        userId,
        title: 'Delete Todo',
        description: 'Delete Description',
      });

      const response = await request(app)
        .delete(`/v1/todos/${todo.id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });
});
