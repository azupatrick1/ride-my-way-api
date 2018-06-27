import express from 'express';
import rides from '../controllers/ride.controller';

const route = express.Router();

//   all ride
route.get('/api/v1/rides', rides.all);

//   create new ride
route.post('/api/v1/rides', rides.create);

// find one ride
route.get('/api/v1/rides/:rideId', rides.findOne);

// update one ride
route.put('/api/v1/rides/:rideId', rides.update);


// delete one ride
route.delete('/api/v1/rides/:rideId', rides.delete);

export default route;
