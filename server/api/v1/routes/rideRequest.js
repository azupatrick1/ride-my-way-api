import express from 'express';
import getRide from '../middlewares/getRide';
import { RideRequest } from '../controllers/index';
import jwtverify from '../middlewares/jwtverify';


const route = express.Router();
// all request
route.get('/api/v1/rides/:rideId/request', jwtverify, getRide, RideRequest.all);
// create a request
route.post('/api/v1/rides/:rideId/request', jwtverify, getRide, RideRequest.create);

export default route;
