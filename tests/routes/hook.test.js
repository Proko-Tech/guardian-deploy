const app = require('../../app/index');
const supertest = require('supertest');

describe('simple test', () => {
  it('GET /hook/github should return status 200', async () => {
    const res = await supertest(app)
        .get('/hook/github');
    expect(res.status).toBe(200);
  });
});
