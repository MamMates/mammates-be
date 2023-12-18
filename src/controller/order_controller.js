import { createOrderValidator } from '../validators/index.js';
import Response from '../dto/responses/index.js';
import { orderDetail } from '../dto/requests/index.js';
import {
  Customer,
  Food,
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
    const orderDetailDto = orderDetail();
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

const holder = null;

export { getAllBuyerOrdersHandler, holder };
