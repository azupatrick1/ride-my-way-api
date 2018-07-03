import supertest from 'supertest';
import { expect } from 'chai';

import app from '../index';


const request = supertest(app);

const userCredentials = {
  username: 'mochatester',
  email: 'mocha@tester.com',
  password: 'chaiexpect',
};
const userCredentials2 = {
  username: 'mochatester',
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
        expect(res.body.data).have.property('token');
      });
    done();
  });
});

describe('testing signins', () => {
  it('should return token and success status', (done) => {
    request
      .post('/auth/signin')
      .send(userCredentials2)
      .expect(200)
      .end((err, res) => {
        expect(res.body.status).to.eql('success');
        expect(res.body.data).have.property('token');
      });
    done();
  });
});

