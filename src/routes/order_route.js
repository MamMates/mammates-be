import express from 'express';
import { verifyToken } from '../middlewares/index.js';
import {
  crateBuyerOrderHandler,
  getBuyerOrdersHandler,
  getRecentOrder,
  getSellerOrdersHandler,
} from '../controller/index.js';

const orderRouter = express.Router();

orderRouter.post('/buyer', verifyToken(2), crateBuyerOrderHandler);
orderRouter.get('/buyer', verifyToken(2), getBuyerOrdersHandler);

orderRouter.get('/recent', verifyToken(1), getRecentOrder);
orderRouter.get('/seller', verifyToken(1), getSellerOrdersHandler);

export default orderRouter;
