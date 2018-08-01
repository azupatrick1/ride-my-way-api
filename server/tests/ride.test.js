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
const faketoken = jwt.sign({ id: '0a758700-91a2-41bf' }, 'this is a secret key', {
  expiresIn: 86400,
});
const token1 = jwt.sign({ id: '0a758700-91a2-41bf-842f-eaca177243a4' }, 'this is a secret key', {
  expiresIn: 86400,
});

const token2 = jwt.sign({ id: '568cd57e-00de-4c62-ab13-257c08348491' }, 'this is a secret key', {
  expiresIn: 86400,
});
describe('Testing user Authorization : sign up', () => {
  it('should return token and success status for correct sign up', (done) => {
    request
      .post('/api/v1/auth/signup')
      .send(userCredentials)
      .expect(200)
      .end((err, res) => {
        expect(res.body.status).to.eql('success');
        expect(res.body.data).have.property('token');
        expect(res.body.data).have.property('message');
        done();
      });
  });
});

describe('Testing user Authorization : sign in', () => {
  it('should return token and success status for correct sign in', (done) => {
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

describe('Testing to get current user details', () => {
  it('should return user and success status for correct token', (done) => {
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

describe('Test cases for all rides', () => {
  it('should return 200 OK response for right params', (done) => {
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

  it('should return 404 response for user not found', (done) => {
    request
      .get('/api/v1/ride')
      .set('x-token-access', faketoken)
      .expect(404)
      .end((err, res) => {
        expect(res.body.status).to.eql('fail');
        done(err);
      });
  });
});


describe('Test cases for creating a ride', () => {
  it('should create a new ride', (done) => {
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
        takeOffDate: '2020-03-04',
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

  it('should create a new ride for second user', (done) => {
    request
      .post('/api/v1/users/rides')
      .set('x-token-access', token2)
      .send({
        name: 'ride456',
        destination: 'lekki',
        location: 'maryland',
        slot: 3,
        time: '12:00',
        carModel: 'mocha drivebus',
        takeOffDate: '2020-03-04',
      })
      .expect(200)
      .end((err, res) => {
        expect(res.body.status).to.eql('success');
        expect(res.body.data).have.property('ride');
        done();
      });
  });
});


describe('Test cases to get a ride with a specific id', () => {
  it('should get 404 error for ride with id not found', (done) => {
    request
      .get('/api/v1/rides/101010')
      .set('x-token-access', token1)
      .expect(404)
      .end((err, res) => {
        expect(res.body.status).to.eql('fail');
        done(err);
      });
  });


  it('should get 200 and return ride by id provided', (done) => {
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

describe('Test cases for creating ride request', () => {
  it('it should fail to create a new ride request for owner', (done) => {
    request
      .post('/api/v1/rides/1/requests')
      .set('x-token-access', token1)
      .expect(403)
      .end((err, res) => {
        expect(res.body.status).to.eql('fail');
        done();
      });
  });

  it('should create a new request for another user', (done) => {
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

describe('Test cases to get all requests for a specific ride', () => {
  it('should return a success status for correct params', (done) => {
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

  it('should return 404 response for wrong url', (done) => {
    request
      .get('/api/v1/rides/1/req')
      .expect(404)
      .end((err, res) => {
        expect(res.body.status).to.eql('fail');
        done(err);
      });
  });
});
describe('Test cases to get all requests for a specific user', () => {
  it('should return a success status for correct params', (done) => {
    request
      .get('/api/v1/requests')
      .set('x-token-access', token1)
      .end((err, res) => {
        expect(res.body.status).to.equal('success');
        expect(res.body.data).to.have.property('requestRecieve');
        expect(res.body.data).to.have.property('requestSent');
        done();
      });
  });
});

describe('Test cases for deciding on a ride request', () => {
  it('should return a fail status response for non owner of ride  accepting ride', (done) => {
    request
      .put('/api/v1/rides/1/requests/1')
      .set('x-token-access', token2)
      .send({ accept: true })
      .end((err, res) => {
        expect(res.body.status).to.equal('fail');
        done();
      });
  });

  it('should return a fail status response for non owner of ride rejection', (done) => {
    request
      .put('/api/v1/rides/1/requests/1')
      .set('x-token-access', token2)
      .send({ accept: false })
      .end((err, res) => {
        expect(res.body.status).to.equal('fail');
        done();
      });
  });

  it('should return 200 OK response for owner of ride', (done) => {
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
  it('should return 400 status response for wrong request id', (done) => {
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

describe('Test cases for cancellation of rides', () => {
  it('should cancel a ride by owner', (done) => {
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

  it('should not cancel ride and return 404 - Not Found for wrong id', (done) => {
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

describe('Test cases for completion of rides', () => {
  it('should complete a ride by owner', (done) => {
    request
      .put('/api/v1/users/rides/2/complete')
      .set('x-token-access', token2)
      .expect(200)
      .end((err, res) => {
        console.log(err);
        expect(res.body.status).to.equal('success');
        done(err);
      });
  });

  it('should not complete ride and return 404 - Not Found for wrong id', (done) => {
    request
      .put('/api/v1/users/rides/101010/complete')
      .set('x-token-access', token1)
      .expect(404)
      .end((err, res) => {
        expect(res.body.status).to.eql('fail');
        done(err);
      });
  });

  it('should not complete a cancelled ride ', (done) => {
    request
      .put('/api/v1/users/rides/1/complete')
      .set('x-token-access', token1)
      .expect(400)
      .end((err, res) => {
        expect(res.body.status).to.eql('fail');
        done(err);
      });
  });
});

