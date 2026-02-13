const request  = require('supertest');
const app      = require('../backend/server');
const mongoose = require('mongoose');

let token, logId;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ss_test');
  const reg = await request(app).post('/api/auth/register').send({
    name: 'Food Tester', email: 'food@test.com', password: 'food1234',
  });
  token = reg.body.token;
});
afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
});

describe('Food Log Routes', () => {
  it('GET /api/food/products — returns all products without auth', async () => {
    const res = await request(app).get('/api/food/products');
    expect(res.statusCode).toBe(200);
    expect(res.body.products.length).toBeGreaterThan(15);
  });

  it('GET /api/food/products?category=Fruits — filters correctly', async () => {
    const res = await request(app).get('/api/food/products?category=Fruits');
    expect(res.statusCode).toBe(200);
    expect(res.body.products.every(p => p.category === 'Fruits')).toBe(true);
  });

  it('POST /api/food/log — logs a food item', async () => {
    const res = await request(app)
      .post('/api/food/log')
      .set('Authorization', `Bearer ${token}`)
      .send({ item: 'Coca-Cola', brix: 18, sugarLevel: 'High', category: 'Cold Drinks', emoji: '🥤' });
    expect(res.statusCode).toBe(201);
    expect(res.body.log.item).toBe('Coca-Cola');
    logId = res.body.log._id;
  });

  it('POST /api/food/log/:id/corrective — awards points on walk completion', async () => {
    const res = await request(app)
      .post(`/api/food/log/${logId}/corrective`)
      .set('Authorization', `Bearer ${token}`)
      .send({ type: 'Walk' });
    expect(res.statusCode).toBe(200);
    expect(res.body.pointsAwarded).toBe(30);  // High sugar = 30 pts
  });

  it('POST /api/food/log/:id/corrective — rejects double completion', async () => {
    const res = await request(app)
      .post(`/api/food/log/${logId}/corrective`)
      .set('Authorization', `Bearer ${token}`)
      .send({ type: 'Exercise' });
    expect(res.statusCode).toBe(400);
  });

  it('GET /api/food/history — returns paginated history', async () => {
    const res = await request(app)
      .get('/api/food/history')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.logs.length).toBeGreaterThanOrEqual(1);
  });
});
