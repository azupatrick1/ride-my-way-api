import express from 'express';
import { Auth } from '../controllers/index';
import jwtverify from '../middlewares/jwtverify';
import validateUser from '../middlewares/validateUser';
import validateUsersign from '../middlewares/validateUsersign';
import getAllRidesTaken from '../middlewares/getAllRidesTaken';
import getAllRidesGiven from '../middlewares/getAllRidesGiven';
import checkRideTime from '../middlewares/checkRideTime';
import validateUserEdit from '../middlewares/validateUserEdit';


const route = express.Router();

route.post('/api/v1/auth/signup', validateUser, Auth.signup);
route.post('/api/v1/auth/signin', validateUsersign, Auth.signin);
route.get('/api/v1/auth/profile', jwtverify, checkRideTime, getAllRidesGiven, getAllRidesTaken, Auth.verifyUser);
route.put('/api/v1/auth/profile/edit', jwtverify, checkRideTime, validateUserEdit, Auth.editUser);
route.get('/api/v1/users/:username', jwtverify, checkRideTime, Auth.getUser);

export default route;
