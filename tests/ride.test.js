const app = require('../index.js');
const supertest = require('supertest');
const { expect } = require('chai');

const request = supertest(app);


describe('Get request for rides', () => {
  it('should return 200 OK response and all rides', (done) => {
    request
      .get('api/v1/rides')
      .expect(200)
      .end((err) => {
        // expect(res.body).to.have.lengthOf(2);
        // expect(res.body).to.eql()
        done(err);
      });
  });

it('should return 404 response', (done) => {
    request
      .get('/api/v1/ride')
      .expect(404)
      .end((err) => {
        done(err);
      });
  });
});
