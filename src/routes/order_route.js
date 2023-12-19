import express from 'express';
import {
   getAllOrderHandler,
} from '../controller/index.js';
import { verifyToken } from '../middlewares';

const orderRouter = express.Router();

orderRouter.get('/', verifyToken(1), getAllOrderHandler);

export default orderRouter;
