const rides = require('../controllers/ride.controller.js');

module.exports = (app) => {
//   all ride
  app.get('/api/v1/rides', rides.all);

   //   create new ride
  app.post('/api/v1/rides', rides.create);
};
