import supertest from 'supertest';
import { expect } from 'chai';

import jwt from 'jsonwebtoken';

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

const token1 = jwt.sign({ id: '0a758700-91a2-41bf-842f-eaca177243a4' }, 'this is a secret key', {
  expiresIn: 86400,
});

const token2 = jwt.sign({ id: '568cd57e-00de-4c62-ab13-257c08348491' }, 'this is a secret key', {
  expiresIn: 86400,
});
describe('testing signups', () => {
  it('should return token and success status', (done) => {
    request
      .post('/api/v1/auth/signup')
      .send(userCredentials)
      .expect(200)
      .end((err, res) => {
        expect(res.body.status).to.eql('success');
        expect(res.body.data).have.property('message');
        done();
      });
  });
});

describe('testing signins', () => {
  it('should return token and success status', (done) => {
    request
      .post('/api/v1/auth/signin')
      .send(userCredentials2)
      .expect(200)
      .end((err, res) => {
        expect(res.body.status).to.eql('success');
        expect(res.body.data).have.property('token');
        done();
      });
  });
});

describe('Testing to get current user', () => {
  it('should return user and success status', (done) => {
    request
      .get('/api/v1/auth/profile')
      .set('x-token-access', token1)
      .expect(200)
      .end((err, res) => {
        expect(res.body.status).to.eql('success');
        expect(res.body.data).have.property('currentUser');
        expect(res.body.data.currentUser.username).to.eql('supertest');
        done();
      });
  });
});

describe('Get request for rides', () => {
  it('should return 200 OK response', (done) => {
    request
      .get('/api/v1/rides')
      .set('x-token-access', token1)
      .end((err, res) => {
        expect(res.body.status).to.equal('success');
        expect(res.body.data.rides).to.be.a('array');
        expect(res.body.data).to.have.property('rides');
        done();
      });
  });

  it('should return 404 response', (done) => {
    request
      .get('/api/v1/ride')
      .expect(404)
      .end((err, res) => {
        expect(res.body.status).to.eql('fail');
        done(err);
      });
  });
});


describe('Post requests for rides', () => {
  it('create a new ride', (done) => {
    request
      .post('/api/v1/users/rides')
      .set('x-token-access', token1)
      .send({
        name: 'ride123',
        destination: 'lagos',
        location: 'abuja',
        slot: 3,
        time: '4:00',
        carModel: 'mocha drivebus',
        takeOffDate: '2018-03-04',
      })
      .expect(200)
      .end((err, res) => {
        expect(res.body.status).to.eql('success');
        expect(res.body.data).have.property('ride');
        done();
      });
  });

  it('should not save new ride and return 400 - bad request', (done) => {
    request
      .post('/api/v1/users/rides')
      .set('x-token-access', token1)
      .send({
        name: 'test1',
      })
      .expect(400)
      .end((err, res) => {
        expect(res.body.status).to.eql('fail');
        done(err);
      });
  });
});


describe('Test the API to get a ride with a specific id', () => {
  it('should get 404 error for id not found', (done) => {
    request
      .get('/api/v1/rides/101010')
      .set('x-token-access', token1)
      .expect(404)
      .end((err, res) => {
        expect(res.body.status).to.eql('fail');
        done(err);
      });
  });


  it('should get 200 and return ride by id', (done) => {
    request
      .get('/api/v1/rides/1')
      .set('x-token-access', token1)
      .expect(200)
      .end((err, res) => {
        expect(res.body.status).to.eql('success');
        done(err);
      });
  });
});

describe('Post requests for rides request', () => {
  it('it should fail to create a new ride request', (done) => {
    request
      .post('/api/v1/rides/1/requests')
      .set('x-token-access', token1)
      .expect(403)
      .end((err, res) => {
        expect(res.body.status).to.eql('fail');
        done();
      });
  });

  it('should create a new request', (done) => {
    request
      .post('/api/v1/rides/1/requests')
      .set('x-token-access', token2)
      .expect(200)
      .end((err, res) => {
        expect(res.body.status).to.eql('success');
        done(err);
      });
  });
});

describe('Get request for all rides request', () => {
  it('should return 200 OK response', (done) => {
    request
      .get('/api/v1/rides/1/requests')
      .set('x-token-access', token1)
      .end((err, res) => {
        expect(res.body.status).to.equal('success');
        expect(res.body.data).to.have.property('requests');
        done();
      });
  });

  it('should get one request when non owner try access to request', (done) => {
    request
      .get('/api/v1/rides/1/requests')
      .set('x-token-access', token2)
      .end((err, res) => {
        expect(res.body.status).to.equal('success');
        expect(res.body.data).to.have.property('request');
        done();
      });
  });

  it('should return 404 response', (done) => {
    request
      .get('/api/v1/rides/1/req')
      .expect(404)
      .end((err, res) => {
        expect(res.body.status).to.eql('fail');
        done(err);
      });
  });
});

describe('Put request for all rides request', () => {
  it('should return 200 OK response', (done) => {
    request
      .put('/api/v1/rides/1/requests/1')
      .set('x-token-access', token2)
      .send({ accept: true })
      .end((err, res) => {
        expect(res.body.status).to.equal('fail');
        done();
      });
  });

  it('should return 200 OK response', (done) => {
    request
      .put('/api/v1/rides/1/requests/1')
      .set('x-token-access', token2)
      .send({ accept: false })
      .end((err, res) => {
        expect(res.body.status).to.equal('fail');
        done();
      });
  });

  it('should return response', (done) => {
    request
      .put('/api/v1/rides/1/requests/1')
      .set('x-token-access', token1)
      .send({ accept: true })
      .expect(200)
      .end((err, res) => {
        expect(res.body.status).to.eql('success');
        done(err);
      });
  });
  it('should return response', (done) => {
    request
      .put('/api/v1/rides/1/requests/abc')
      .set('x-token-access', token1)
      .send({ accept: true })
      .expect(400)
      .end((err, res) => {
        expect(res.body.status).to.eql('error');
        done(err);
      });
  });
});

describe('Delete request for rides', () => {
  it('should cancel a ride', (done) => {
    request
      .delete('/api/v1/rides/1')
      .set('x-token-access', token1)
      .expect(200)
      .end((err, res) => {
        expect(res.body.status).to.equal('success');
        expect(res.body.data.message).to.eql('The ride has been cancelled');
        done(err);
      });
  });

  it('should not delete ride and return 404 - Not Found', (done) => {
    request
      .delete('/api/v1/rides/101010')
      .set('x-token-access', token1)
      .expect(404)
      .end((err, res) => {
        expect(res.body.status).to.eql('fail');
        done(err);
      });
  });
});

