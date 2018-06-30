import express from 'express';
import { validateRequest } from '../middlewares/validate';
import getRide from '../middlewares/getRide';
import { all, create } from '../controllers/rideRequest.controller';

const route = express.Router();
// all request
route.get('/api/v1/rides/:rideId/request', getRide, all);
// create a request
route.post('/api/v1/rides/:rideId/request', getRide, validateRequest, create);

export default route;
