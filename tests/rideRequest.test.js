const app = require('../index.js');
const supertest = require('supertest');
const { expect } = require('chai');

const request = supertest(app);

beforeEach((done) => {
  app.ridesDB = [
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

  app.requestDB = [{
    id: 1,
    rideId: 1,
    rideName: 'emeka',
    sender: 'john',
    status: 'sent',
  },
  ];

  done();
});


describe('Get request for ride request', () => {
  it('should return a 200 response and length of array of rides and all request from id ', (done) => {
    request
      .get('/api/v1/rides/1/request')
      .expect(200)
      .end((err) => {
        done(err);
      });
  });

  it('should return 404 response', (done) => {
    request
      .get('/api/v1/rides/3/request')
      .expect(404)
      .end((err) => {
        done(err);
      });
  });
});


describe('Post request for ride request', () => {
  it('save a new requests', (done) => {
    const ride = app.ridesDB.find(c => c.id === 2);
    request
      .post('/api/v1/rides/2/request')
      .send({
        sender: 'mocha test',
      })
      .expect(201)
      .end((err, res) => {
        expect(res.body).to.eql({
          id: app.requestDB.length + 1,
          rideId: ride.id,
          rideName: ride.name,
          sender: 'mocha test',
          status: 'sent',
        });
        done(err);
      });
  });

  it('should not save new request and return 400 - bad request', (done) => {
    request
      .post('/api/v1/rides/2/request')
      .send({
        sender: 'te',
      })
      .expect(400)
      .end((err) => {
        done(err);
      });
  });
});
