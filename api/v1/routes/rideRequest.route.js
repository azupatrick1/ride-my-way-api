const request = require('../controllers/rideRequest.controller.js');

module.exports = (app) => {
// all request
  app.get('/api/v1/rides/:rideId/request', request.all);

  // create a request
  app.post('/api/v1/rides/:rideId/request', request.create);
};
