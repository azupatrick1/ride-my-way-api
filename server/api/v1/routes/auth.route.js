import express from 'express';
import { signup, verifyUser } from '../controllers/auth.controller';
import jwtverify from '../middlewares/jwtverify';

const route = express.Router();

route.post('/auth/signup', signup);
route.get('/auth/me', jwtverify, verifyUser);

export default route;
