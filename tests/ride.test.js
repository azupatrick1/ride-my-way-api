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
      time: '7:00 pm',
    },
    {
      id: 2,
      name: 'ride1344',
      from: 'Lagos',
      to: 'Aba',
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
