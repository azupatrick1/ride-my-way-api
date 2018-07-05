import supertest from 'supertest';
import { expect } from 'chai';
// import { Client } from 'pg';
import jwt from 'jsonwebtoken';

import app from '../index';


const request = supertest(app);

// let supertoken;
const weaktoken = jwt.sign({ id: '0a758700-91a2-41bf-842f-eaca177243a4' }, 'this is a secret key', {
  expiresIn: 86400, // expires in 24 hours
});

const userCredentials = {
  username: 'mochatester',
  email: 'mocha@tester.com',
  password: 'chaiexpect',
};
const userCredentials2 = {
  username: 'mochatester',
  password: 'chaiexpect',
};

describe('Testing ride my way API', () => {
  describe('testing signups', () => {
    it('should return token and success status', (done) => {
      request
        .post('/auth/signup')
        .send(userCredentials)
        .expect(200)
        .end((err, res) => {
          expect(res.body.status).to.eql('success');
          expect(res.body.data).have.property('message');
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

  describe('Testing Get all ride', () => {
    it('should return user and success status', (done) => {
      request
        .post('/auth/me')
        .send('x-token-access', weaktoken)
        .expect(200)
        .end((err, res) => {
          // expect(res.body.status).to.eql('success');
          expect(res.body.data).have.property('user');
        });
      done();
    });
  });
});

