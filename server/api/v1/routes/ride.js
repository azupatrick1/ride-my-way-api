import express from 'express';
import validateRide from '../middlewares/validateRide';
import getRide from '../middlewares/getRide';
import checkRide from '../middlewares/checkRide';
import { Ride } from '../controllers/index';
import jwtverify from '../middlewares/jwtverify';


const route = express.Router();

route.get('/api/v1/rides', jwtverify, Ride.getAllRide);

route.post('/api/v1/users/rides', jwtverify, checkRide, validateRide, Ride.createRide);

route.get('/api/v1/rides/:rideId', jwtverify, getRide, Ride.findOneRide);


route.delete('/api/v1/rides/:rideId', jwtverify, getRide, Ride.deleteRide);

export default route;
