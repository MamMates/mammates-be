import express from 'express';
import { verifyToken } from '../middlewares/index.js';
import { crateBuyerOrderHandler, getBuyerOrdersHandler } from '../controller/index.js';

const orderRouter = express.Router();

orderRouter.post('/buyer', verifyToken(2), crateBuyerOrderHandler);
orderRouter.get('/buyer', verifyToken(2), getBuyerOrdersHandler);

export default orderRouter;
