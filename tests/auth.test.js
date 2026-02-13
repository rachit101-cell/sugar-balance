const request = require('supertest');
const app     = require('../backend/server');
const mongoose = require('mongoose');

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ss_test');
});
afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
});

describe('Auth Routes', () => {
  let token;

  it('POST /api/auth/register — creates user and returns token', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name:     'Test User',
      email:    'test@example.com',
      password: 'test1234',
      profile:  { age: 25, height: 170, weight: 65, sleepHours: 7, dailySteps: 5000 },
    });
    expect(res.statusCode).toBe(201);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.points).toBe(50);  // onboarding bonus
    token = res.body.token;
  });

  it('POST /api/auth/register — rejects duplicate email', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Another', email: 'test@example.com', password: 'pass123',
    });
    expect(res.statusCode).toBe(409);
  });

  it('POST /api/auth/login — returns token for valid credentials', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'test@example.com', password: 'test1234',
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it('POST /api/auth/login — rejects wrong password', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'test@example.com', password: 'wrongpass',
    });
    expect(res.statusCode).toBe(401);
  });

  it('GET /api/auth/me — returns current user with valid token', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.user.email).toBe('test@example.com');
  });

  it('GET /api/auth/me — rejects without token', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.statusCode).toBe(401);
  });
});
