import express from 'express';
import { verifyToken } from '../middlewares/index.js';
import { getAllBuyerOrdersHandler, getSellerOrdersHandler } from '../controller/order_controller.js';

const orderRouter = express.Router();

orderRouter.post('/buyer', verifyToken(2), getAllBuyerOrdersHandler);
orderRouter.get('/buyer', verifyToken(2), getSellerOrdersHandler);

export default orderRouter;
