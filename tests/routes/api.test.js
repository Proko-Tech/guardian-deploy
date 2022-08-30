const app = require('../../app/index');
const supertest = require('supertest');

describe('simple test', () => {
  it('GET /api should return status 200', async () => {
    const res = await supertest(app)
        .get('/api/');
    expect(res.status).toBe(200);
  });
});
