import express from 'express';
import { validateRequest } from '../middlewares/validate';
import getRide from '../middlewares/getRide';
import { RideRequest } from '../controllers/index';

const route = express.Router();
// all request
route.get('/api/v1/rides/:rideId/request', getRide, RideRequest.all());
// create a request
route.post('/api/v1/rides/:rideId/request', getRide, validateRequest, RideRequest.create);

export default route;
