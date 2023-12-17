import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { createBcrypt } from '../utils/index.js';
import { sequelize } from '../pkg/index.js';
import {
  sellerRegisterHandler,
  loginHandler,
} from '../controller/index.js';
import { Account, Customer } from '../models/index.js';
import { buyerRegisterValidator } from '../validators/index.js';
import Response from '../dto/responses/index.js';

const authRouter = express.Router();

authRouter.post('/register/seller', sellerRegisterHandler);
authRouter.post('/register/buyer', buyerRegisterValidator);
authRouter.post('/login', loginHandler);

export default authRouter;
