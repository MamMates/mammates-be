import express from 'express';
import {
  sellerRegisterHandler,
  loginHandler,
} from '../controller/index.js';

const authRouter = express.Router();

authRouter.post('/register/seller', sellerRegisterHandler);
authRouter.post('/login', loginHandler);

export default authRouter;
