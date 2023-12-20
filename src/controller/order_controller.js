import { createOrderValidator } from '../validators/index.js';
import Response from '../dto/responses/index.js';
import { createOrderDetail, ordersDetail, recentOrder } from '../dto/requests/index.js';
import {
  Customer,
  Food,
  Merchant,
  Order,
  OrderDetail,
} from '../models/index.js';
import { sequelize } from '../pkg/index.js';

const crateBuyerOrderHandler = async (req, res) => {
  let response;
  const { decodedToken } = res.locals;
  const reqBody = req.body;

  const reqError = createOrderValidator(reqBody);
  if (reqError.length !== 0) {
    response = Response.defaultBadRequest({ errors: reqError });
    return res.status(response.code).json(response);
  }

  let totalPrice = 0;
  let orderDetails = await Promise.all(reqBody.foods.map(async (food) => {
    const foodDetail = await Food.findByPk(
      food.food_id,
      { attributes: ['price'] },
    );
    const orderDetailDto = createOrderDetail();
    const price = foodDetail.price * food.quantity;

    orderDetailDto.FoodId = food.food_id;
    orderDetailDto.quantity = food.quantity;
    orderDetailDto.price = price;
    totalPrice += price;

    return orderDetailDto;
  }));

  const orderTransaction = async (t) => {
    const customer = await Customer.findOne({
      where: {
        AccountId: decodedToken.id,
      },
      attributes: ['id'],
    }, { transaction: t });
    const order = await Order.create({
      CustomerId: customer.id,
      MerchantId: reqBody.seller_id,
      total_price: totalPrice,
    }, { transaction: t });

    orderDetails = orderDetails.map((detail) => ({ OrderId: order.id, ...detail }));
    await OrderDetail.bulkCreate(orderDetails, { transaction: t });
  };

  const result = await sequelize.transaction(orderTransaction)
    .catch((error) => error);
  if (result instanceof Error) {
    response = Response.defaultInternalError({ error: result });
    return res.status(response.code).json(response);
  }

  response = Response.defaultCreated('order created successfully', null);
  return res.status(response.code).json(response);
};

const getBuyerOrdersHandler = async (req, res) => {
  let response;
  const { decodedToken } = res.locals;
  const reqQuery = req.query;

  const orderCondition = {};
  if (reqQuery.id) {
    orderCondition.id = reqQuery.id;
  }

  const customer = await Customer.findOne({
    where: {
      AccountId: decodedToken.id,
    },
    attributes: ['id'],
  })
    .catch(() => {
      response = Response.defaultInternalError(null);
      return res.status(response.code).json(response);
    });

  if (!customer) {
    response = Response.defaultNotFound(null);
    return res.status(response.code).json(response);
  }

  const rawOrders = await Order.findAll({
    where: {
      CustomerId: customer.id,
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
        model: Merchant,
        attributes: ['store'],
      },
    ],
  })
    .catch((error) => error);
  if (rawOrders instanceof Error) {
    response = Response.defaultInternalError({ error: rawOrders });
    return res.status(response.code).json(response);
  }

  const orders = rawOrders.map((order) => {
    const { orderList } = ordersDetail();
    const prefixLink = 'https://storage.googleapis.com/';
    const suffixLink = '?ignoreCache=1';
    let orderDate = new Date(order.createdAt);
    orderDate.setHours(orderDate.getHours() + 8);
    orderDate = orderDate.toISOString().slice(0, 19).replace('T', ' ');
    orderDate += ' WITA';

    orderList.id = reqQuery.id ? undefined : order.id;
    orderList.invoice = reqQuery.id ? `MM/INV/${customer.id}/${order.id}` : undefined;
    orderList.time = reqQuery.id ? orderDate : undefined;

    orderList.store = order.Merchant.store;
    orderList.total = order.total_price;
    orderList.status = order.OrderStatusId;

    const foods = order.OrderDetails.map((orderDetail) => {
      const { foodList } = ordersDetail();
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

  const responseData = reqQuery.id ? { order: orders[0] } : { orders };
  response = Response.defaultOK('success get orders', responseData);
  return res.status(response.code).send(response);
};

const getRecentOrder = async (req, res) => {
  let response;
  const { decodedToken } = res.locals;

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
    },
    order: [
      ['createdAt', 'DESC'],
    ],
    include: {
      model: Customer,
      attributes: ['name'],
    },
    limit: 3,
  })
    .catch((error) => error);
  if (rawOrders instanceof Error) {
    response = Response.defaultInternalError({ error: rawOrders });
    return res.status(response.code).json(response);
  }

  const orders = rawOrders.map((rawOrder) => {
    const recent = recentOrder();
    recent.id = rawOrder.id;
    recent.buyer = rawOrder.Customer.name;
    recent.status = rawOrder.OrderStatusId;

    return recent;
  });

  response = Response.defaultOK('success get recent order', { orders });
  return res.status(response.code).json(response);
};

export {
  crateBuyerOrderHandler,
  getBuyerOrdersHandler,
  getRecentOrder,
};
