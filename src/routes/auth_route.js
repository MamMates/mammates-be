import express from 'express';
import {
  sellerRegisterHandler,
  loginHandler,
  buyerRegisterHandler,
} from '../controller/index.js';

const authRouter = express.Router();

authRouter.post('/register/seller', sellerRegisterHandler);
authRouter.post('/register/buyer', buyerRegisterHandler);
authRouter.post('/login', loginHandler);

export default authRouter;
