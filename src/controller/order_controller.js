import { createOrderValidator } from '../validators/index.js';
import Response from '../dto/responses/index.js';
import { createOrderDetail, ordersDetail } from '../dto/requests/index.js';
import {
  Customer,
  Food,
  Merchant,
  Order,
  OrderDetail,
} from '../models/index.js';
import { sequelize } from '../pkg/index.js';

const getAllBuyerOrdersHandler = async (req, res) => {
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

const getSellerOrdersHandler = async (req, res) => {
  let response;
  const { decodedToken } = res.locals;

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

    orderList.id = order.id;
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

  response = Response.defaultOK('success get orders', { orders });
  return res.status(response.code).send(response);
};

export { getAllBuyerOrdersHandler, getSellerOrdersHandler };
