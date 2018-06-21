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


describe('Get request for rides', () => {
  it('should return 200 OK response and all rides', (done) => {
    request
      .get('/api/v1/rides')
      .expect(200)
      .end((err, res) => {
        expect(res.body).to.have.lengthOf(app.ridesDB.length);
        expect(res.body).to.eql(app.ridesDB);
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


describe('Post requests for rides', () => {
  it('create a new ride', (done) => {
    request
      .post('/api/v1/rides')
      .send({
        name: 'test ride',
        from: 'Lagos',
        to: 'Aba',
        driver: 'mocha',
        time: '6:00 am',
      })
      .expect(201)
      .end((err, res) => {
        expect(res.body).to.eql({
          id: app.ridesDB.length + 1,
          name: 'test ride',
          from: 'Lagos',
          to: 'Aba',
          driver: 'mocha',
          time: '6:00 am',
        });
        done(err);
      });
  });

  it('should not save new ride and return 400 - bad request', (done) => {
    request
      .post('/api/v1/rides')
      .send({
        name: 'test 1',
      })
      .expect(400)
      .end((err) => {
        done(err);
      });
  });
});
