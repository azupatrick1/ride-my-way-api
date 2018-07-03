import express from 'express';
import { validateRide } from '../middlewares/validate';
import getRide from '../middlewares/getRide';
import { Ride } from '../controllers/index';
import jwtverify from '../middlewares/jwtverify';


const route = express.Router();

//   all ride
route.get('/api/v1/rides', jwtverify, Ride.all);

//   create new ride
route.post('/api/v1/users/rides', jwtverify, validateRide, Ride.create);

// find one ride
route.get('/api/v1/rides/:rideId', jwtverify, getRide, Ride.findOne);

// update one ride
route.put('/api/v1/rides/:rideId', getRide, validateRide, Ride.update);


// delete one ride
route.delete('/api/v1/rides/:rideId', getRide, Ride.deleteRide);

export default route;
