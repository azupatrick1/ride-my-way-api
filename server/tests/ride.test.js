import supertest from 'supertest';
import { expect } from 'chai';

import app from '../index';

const request = supertest.agent(app);


let toke;

before((done) => {
  request
    .post('/auth/signup')
    .send({
      username: 'mochatester',
      email: 'mochatester@gmail.com',
      password: 'chaiexpect',
    })
    .end((err, response) => {
      toke = response.body.data.token; // save the token!
      done();
    });
});


const ridesDB = [
  {
    id: 1,
    name: 'ride1234',
    from: 'Abuja',
    to: 'Lagos',
    driver: 'driver 1',
    time: '7:00 pm',
  },
  {
    id: 2,
    name: 'ride1344',
    from: 'Lagos',
    to: 'Aba',
    driver: 'driver 2',
    time: '6:00 am',
  },
];


describe('Get request for rides', () => {
  it('should return 200 OK response and all rides', (done) => {
    request
      .get('/api/v1/rides')
      .expect(200)
      .end((err, res) => {
        expect(res.body.status).to.eql('success');
        expect(res.body.data.rides).to.have.lengthOf(ridesDB.length);
        expect(res.body.data).to.eql({
          rides: ridesDB,
        });
        done(err);
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
      .set('Authorization', `Bearer ${toke}`)
      .post('/users/rides')
      .send({
        name: 'test ride',
        location: 'Lagos',
        destination: 'Aba',
        slot: 4,
        time: '6:00 am',
      })
      .expect(201)
      .end((err, res) => {
        expect(res.body.status).to.eql('success');
        expect(res.body.data).have.property('ride');
        done(err);
      });
  });

  it('should not save new ride and return 400 - bad request', (done) => {
    request
      .post('/users/rides')
      .send({
        name: 'test 1',
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
      .expect(404)
      .end((err, res) => {
        expect(res.body.status).to.eql('fail');
        done(err);
      });
  });


  it('should get 200 and return ride by id', (done) => {
    const ride = ridesDB.find(c => c.id === 1);
    request
      .get('/api/v1/rides/1')
      .expect(200)
      .end((err, res) => {
        expect(res.body.status).to.eql('success');
        expect(res.body.data).to.eql({ ride });
        done(err);
      });
  });
});


describe('Put request for rides', () => {
  it('should update a ride', (done) => {
    request
      .put('/api/v1/rides/1')
      .send({
        name: 'test updated',
        from: 'Lagos',
        to: 'benin',
        driver: 'mocha',
        time: '6:00 am',
      })
      .expect(200)
      .end((err, res) => {
        expect(res.body.status).to.eql('success');
        expect(res.body.data).to.eql({
          ride: {
            id: 1,
            name: 'test updated',
            from: 'Lagos',
            to: 'benin',
            driver: 'mocha',
            time: '6:00 am',
          },
        });
        done(err);
      });
  });

  it('should not update ride and return 400 - bad request', (done) => {
    request
      .put('/api/v1/rides/1')
      .send({
        name: 'test 1',
      })
      .expect(400)
      .end((err, res) => {
        expect(res.body.status).to.eql('fail');
        done(err);
      });
  });

  it('should not update ride and return 404 - Not Found', (done) => {
    request
      .put('/api/v1/rides/101010')
      .expect(404)
      .end((err, res) => {
        expect(res.body.status).to.eql('fail');
        done(err);
      });
  });
});

describe('Delete request for rides', () => {
  it('should delete a ride', (done) => {
    request
      .delete('/api/v1/rides/3')
      .expect(200)
      .end((err, res) => {
        expect(res.body.status).to.eql('success');
        expect(res.body.data).to.eql(null);
        done(err);
      });
  });

  it('should not delete ride and return 404 - Not Found', (done) => {
    request
      .delete('/api/v1/rides/101010')
      .expect(404)
      .end((err, res) => {
        expect(res.body.status).to.eql('fail');
        done(err);
      });
  });
});

