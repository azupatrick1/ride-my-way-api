import express from 'express';
import { Auth } from '../controllers//index';
import jwtverify from '../middlewares/jwtverify';
import { validateUser, validateUsersign } from '../middlewares/validate';


const route = express.Router();

route.post('/auth/signup', validateUser, Auth.signup);
route.post('/auth/signin', validateUsersign, Auth.signin);
route.get('/auth/profile', jwtverify, Auth.verifyUser);

export default route;
