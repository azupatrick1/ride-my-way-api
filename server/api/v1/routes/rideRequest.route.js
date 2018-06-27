import express from 'express';
import request from '../controllers/rideRequest.controller';

const route = express.Router();
// all request
route.get('/api/v1/rides/:rideId/request', request.all);
// create a request
route.post('/api/v1/rides/:rideId/request', request.create);

export default route;
