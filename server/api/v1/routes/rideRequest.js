import express from 'express';
import getRide from '../middlewares/getRide';
import validateReq from '../middlewares/validateReq';
import getRequest from '../middlewares/getRequest';
import getReqUser from '../middlewares/getReqUser';
import { RideRequest } from '../controllers/index';
import jwtverify from '../middlewares/jwtverify';
import getRequestRecieve from '../middlewares/getRequestrecieve';
import getRequestSent from '../middlewares/getRequestsent';


const route = express.Router();

route.get('/api/v1/rides/:rideId/requests', jwtverify, getRide, RideRequest.getAllRequest);
route.get('/api/v1/requests', jwtverify, getRequestRecieve, getRequestSent, RideRequest.getAllEverRequests);

route.post('/api/v1/rides/:rideId/requests', jwtverify, getRide, getReqUser, RideRequest.createRequest);

route.put('/api/v1/rides/:rideId/requests/:requestId', jwtverify, getRide, getRequest, validateReq, RideRequest.decideRequestOption);

export default route;
