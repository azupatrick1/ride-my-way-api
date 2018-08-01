import express from 'express';
import validateRide from '../middlewares/validateRide';
import getRide from '../middlewares/getRide';
import checkRide from '../middlewares/checkRide';
import { Ride } from '../controllers/index';
import jwtverify from '../middlewares/jwtverify';
import checkRideTime from '../middlewares/checkRideTime';


const route = express.Router();

route.get('/api/v1/rides', jwtverify, checkRideTime, Ride.getAllRide);

route.post('/api/v1/users/rides', jwtverify, checkRideTime, checkRide, validateRide, Ride.createRide);

route.get('/api/v1/rides/:rideId', jwtverify, checkRideTime, getRide, Ride.findOneRide);

route.put('/api/v1/users/rides/:rideId', jwtverify, checkRideTime, getRide, validateRide, Ride.editRide);

route.put('/api/v1/users/rides/:rideId/complete', jwtverify, checkRideTime, getRide, Ride.completeRide);


route.delete('/api/v1/rides/:rideId', jwtverify, checkRideTime, getRide, Ride.cancelRide);

export default route;
