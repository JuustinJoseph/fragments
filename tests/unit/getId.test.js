const request = require('supertest');
const hash = require('../../src/hash');

const app = require('../../src/app');
const { readFragmentData } = require('../../src/model/data');

describe('GET /v1/fragments', () => {
  test('authenticated user gets fragment by ID', async () => {
    const req = await request(app)
      .post('/v1/fragments/')
      .auth('user1@email.com', 'password1')
      .send('This is a testing fragment')
      .set('Content-type', 'text/plain');
    const fragment = await readFragmentData(hash('user1@email.com'), req.body.fragment.id);
    const res = await request(app)
      .get(`/v1/fragments/${req.body.fragment.id}`)
      .auth('user1@email.com', 'password1');

    expect(res.text).toBe(fragment.toString());
  });

  test('invalid fragment ID for the GET request should give an appropriate error', async () => {
    const res = await request(app)
      .get('/v1/fragments/invalidID')
      .auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(404);
    expect(res.body.error.message).toBe('Unknown Fragment');
  });

  test('successful conversion of markdown(.md) extension to html', async () => {
    const req = await request(app)
      .post('/v1/fragments/')
      .auth('user1@email.com', 'password1')
      .send('# This is a markdown type fragment')
      .set('Content-type', 'text/markdown');

    const res = await request(app)
      .get(`/v1/fragments/${req.body.fragment.id}.html`)
      .auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(200);
    expect(res.text).toEqual('<h1>This is a markdown type fragment</h1>\n');
  });
});
