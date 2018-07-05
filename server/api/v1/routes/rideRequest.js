import express from 'express';
import getRide from '../middlewares/getRide';
import { validateReq } from '../middlewares/validate';
import getRequest from '../middlewares/getRequest';
import getReqUser from '../middlewares/getReqUser';
import { RideRequest } from '../controllers/index';
import jwtverify from '../middlewares/jwtverify';


const route = express.Router();
// all request
route.get('/api/v1/rides/:rideId/requests', jwtverify, getRide, RideRequest.getAllRequest);
// create a request
route.post('/api/v1/rides/:rideId/requests', jwtverify, getRide, getReqUser, RideRequest.createRequest);
route.put('/api/v1/rides/:rideId/requests/:requestId', jwtverify, getRide, getRequest, validateReq, RideRequest.decideRequestOption);

export default route;
