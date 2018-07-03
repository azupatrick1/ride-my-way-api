import express from 'express';
import { Auth } from '../controllers//index';
import jwtverify from '../middlewares/jwtverify';

const route = express.Router();

route.post('/auth/signup', Auth.signup);
route.post('/auth/signin', Auth.signin);
route.get('/auth/me', jwtverify, Auth.verifyUser);

export default route;
