const request = require('supertest');

const app = require('../../src/app');

describe('404 check', () => {
  test('expect 404 on non-existent route', () => request(app).get('/test').expect(404));
});
