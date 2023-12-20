import express from 'express';
import { verifyToken } from '../middlewares/index.js';
import { crateBuyerOrderHandler, getBuyerOrdersHandler, getRecentOrder } from '../controller/index.js';
import {
  Customer,
  Food,
  Merchant,
  Order,
  OrderDetail,
} from '../models/model_definitions.js';
import { sellerOrdersDetail } from '../dto/requests/order_dto.js';
import Response from '../dto/responses/default_response.js';

const orderRouter = express.Router();

orderRouter.post('/buyer', verifyToken(2), crateBuyerOrderHandler);
orderRouter.get('/buyer', verifyToken(2), getBuyerOrdersHandler);

orderRouter.get('/recent', verifyToken(1), getRecentOrder);
orderRouter.get('/seller', verifyToken(1), async (req, res) => {
  let response;
  const { decodedToken } = res.locals;
  const reqQuery = req.query;

  const orderCondition = {};
  if (reqQuery.id) {
    orderCondition.id = reqQuery.id;
  }

  const merchant = await Merchant.findOne({
    where: {
      AccountId: decodedToken.id,
    },
    attributes: ['id'],
  })
    .catch(() => {
      response = Response.defaultInternalError(null);
      return res.status(response.code).json(response);
    });

  if (!merchant) {
    response = Response.defaultNotFound(null);
    return res.status(response.code).json(response);
  }

  const rawOrders = await Order.findAll({
    where: {
      MerchantId: merchant.id,
      ...orderCondition,
    },
    include: [
      {
        model: OrderDetail,
        include: {
          model: Food,
          attributes: ['last_photo', 'name'],
          paranoid: false,
        },
      },
      {
        model: Customer,
        attributes: ['id', 'name'],
      },
    ],
  })
    .catch((error) => error);
  if (rawOrders instanceof Error) {
    response = Response.defaultInternalError({ error: rawOrders });
    return res.status(response.code).json(response);
  }

  const orders = rawOrders.map((order) => {
    const { orderList } = sellerOrdersDetail();
    const prefixLink = 'https://storage.googleapis.com/';
    const suffixLink = '?ignoreCache=1';
    let orderDate = new Date(order.createdAt);
    orderDate.setHours(orderDate.getHours() + 8);
    orderDate = orderDate.toISOString().slice(0, 19).replace('T', ' ');
    orderDate += ' WITA';

    orderList.id = reqQuery.id ? undefined : order.id;
    orderList.invoice = reqQuery.id ? `MM/INV/${order.Customer.id}/${order.id}` : undefined;
    orderList.time = reqQuery.id ? orderDate : undefined;

    orderList.buyer = order.Customer.name;
    orderList.total = order.total_price;
    orderList.status = order.OrderStatusId;

    const foods = order.OrderDetails.map((orderDetail) => {
      const { foodList } = sellerOrdersDetail();
      foodList.name = orderDetail.Food.name;
      foodList.quantity = orderDetail.quantity;
      foodList.price = orderDetail.price;
      foodList.image = `${prefixLink}${process.env.BUCKET_NAME}/`
      + `${orderDetail.Food.last_photo}${suffixLink}`;

      return foodList;
    });

    orderList.foods = foods;
    return orderList;
  });

  if (reqQuery.id && orders.length === 0) {
    response = Response.defaultNotFound(null);
    return res.status(response.code).json(response);
  }

  const responseData = reqQuery.id ? { order: orders[0] } : { orders };
  response = Response.defaultOK('success get orders', responseData);
  return res.status(response.code).send(response);
});

export default orderRouter;
