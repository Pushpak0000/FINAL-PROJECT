import express from 'express';
import { getProfile, login, logout, refereshAccessToken, signup } from '../controllers/auth.controllers.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const route = express.Router();


route.post('/signup', signup);

route.post('/login', login);

route.post('/logout',verifyJWT, logout);

route.post('/refresh-token', refereshAccessToken)

route.get('/profile', verifyJWT, getProfile);

export default route;