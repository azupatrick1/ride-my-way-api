import supertest from 'supertest';
import { expect } from 'chai';

import app from '../index';

process.env.NODE_ENV = 'test';


const request = supertest(app);

const userCredentials = {
  username: 'mochatester',
  email: 'mocha@tester.com',
  password: 'chaiexpect',
};

describe('testing signups', () => {
  it('should return token and success status', (done) => {
    request
      .post('/auth/signup')
      .send(userCredentials)
      .expect(200)
      .end((err, res) => {
        expect(res.body.status).to.eql('success');
      });
    done();
  });
});
