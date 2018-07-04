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
describe('Testing ride my way API', () => {
  let supertoken;
  let weaktoken;

  before((done) => {
    request
      .post('/auth/signup')
      .send({
        username: 'superUser',
        email: 'superuser@gmail.com',
        password: 'supersecret',
      })
      .end((err, res) => {
        supertoken = res.body.data.token;
        done();
      });

    request
      .post('/auth/signup')
      .send({
        username: 'weakUser',
        email: 'weakuser@gmail.com',
        password: 'weaksecret',
      })
      .end((err, res) => {
        weaktoken = res.data.token;
        done();
      });
  });

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

  describe('testing current user', () => {
    it('should return user and success status', (done) => {
      request
        .post('/auth/me')
        .send('x-token-access', weaktoken)
        .expect(200)
        .end((err, res) => {
          expect(res.body.status).to.eql('success');
          expect(res.body.data).have.property('user');
        });
      done();
    });
  });






});

