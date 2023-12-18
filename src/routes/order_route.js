import express from 'express';
import { verifyToken } from '../middlewares/index.js';
import getAllBuyerOrdersHandler from '../controller/order_controller.js';

const orderRouter = express.Router();

orderRouter.post('/buyer', verifyToken(2), getAllBuyerOrdersHandler);

export default orderRouter;
