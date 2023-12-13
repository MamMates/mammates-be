import express from 'express';
import sellerRegisterHandler from '../controller/auth_controller.js';

const authRouter = express.Router();

authRouter.post('/register/seller', sellerRegisterHandler);

export default authRouter;
