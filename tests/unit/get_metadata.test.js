const request = require('supertest');

const app = require('../../src/app');

describe('GET v1/fragments/:id/info', () => {
  test('Get fragments metadata by valid user ID', async () => {
    const req = await request(app)
      .post('/v1/fragments')
      .send('This is a testing fragment')
      .set('Content-Type', 'text/plain')
      .auth('user1@email.com', 'password1');

    const res = await request(app)
      .get(`/v1/fragments/${req.body.fragment.id}/info`)
      .auth('user1@email.com', 'password1');

    expect(res.statusCode).toBe(200);
    expect(req.body).toEqual(res.body);
  });

  test('Get fragments metadata by invalid user ID', async () => {
    const req = await request(app)
      .post('/v1/fragments')
      .send('This is a fragment')
      .set('Content-Type', 'text/plain')
      .auth('user1@email.com', 'password1');

    const res = await request(app)
      .get(`/v1/fragments/${req.body.fragment.id}abc/info`)
      .auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(404);
  });
});
