import express from 'express';
import { validateRide } from '../middlewares/validate';
import getRide from '../middlewares/getRide';
import { all, create, findOne, update, deleteRide } from '../controllers/ride.controller';
import jwtverify from '../middlewares/jwtverify';


const route = express.Router();

//   all ride
route.get('/api/v1/rides', jwtverify, all);

//   create new ride
route.post('/api/v1/users/rides', jwtverify, validateRide, create);

// find one ride
route.get('/api/v1/rides/:rideId', jwtverify, getRide, findOne);

// update one ride
route.put('/api/v1/rides/:rideId', getRide, validateRide, update);


// delete one ride
route.delete('/api/v1/rides/:rideId', getRide, deleteRide);

export default route;
