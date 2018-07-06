import express from 'express';
import { Auth } from '../controllers//index';
import jwtverify from '../middlewares/jwtverify';
import validateUser from '../middlewares/validateUser';
import validateUsersign from '../middlewares/validateUsersign';


const route = express.Router();

route.post('/api/v1/auth/signup', validateUser, Auth.signup);
route.post('/api/v1/auth/signin', validateUsersign, Auth.signin);
route.get('/api/v1/auth/profile', jwtverify, Auth.verifyUser);

export default route;
