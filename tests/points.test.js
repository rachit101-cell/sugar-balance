const request  = require('supertest');
const app      = require('../backend/server');
const mongoose = require('mongoose');

let token;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ss_test');
  const reg = await request(app).post('/api/auth/register').send({
    name: 'Points Tester', email: 'points@test.com', password: 'pts1234',
  });
  token = reg.body.token;
});
afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
});

describe('Points Routes', () => {
  it('GET /api/points — returns total and streak', async () => {
    const res = await request(app)
      .get('/api/points')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.total).toBeGreaterThanOrEqual(50);  // onboarding bonus
    expect(typeof res.body.streak).toBe('number');
  });

  it('POST /api/points/award — awards points and updates total', async () => {
    const before = (await request(app).get('/api/points').set('Authorization', `Bearer ${token}`)).body.total;
    const res = await request(app)
      .post('/api/points/award')
      .set('Authorization', `Bearer ${token}`)
      .send({ amount: 20, event: 'corrective_action', description: 'Test walk' });
    expect(res.statusCode).toBe(200);
    expect(res.body.newTotal).toBe(before + 20);
  });

  it('GET /api/points/history — returns daily breakdown', async () => {
    const res = await request(app)
      .get('/api/points/history?days=7')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.history)).toBe(true);
  });
});
