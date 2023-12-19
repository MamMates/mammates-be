import { Merchant, Order } from '../models/index.js';

import Response from '../dto/responses/index.js';

const getAllOrderHandler = async (req, res) => {
   let respone;
   const { decodedToken } = res.locals;

   const order = await Order.findAll({
      where: {
         AccountId: decodedToken.id,
       },
      include: [
         {
            model: Customer,
            attributes: ['id'],
         },
         {
            model: OrderDetail,
            attributes: ['id', 'quantity', 'price', 'foods'],
         }
      ]
   })
   .then((order) => order.Order)
   .catch((error) => {
      const err = new Error(error);
      return err;
   });

   if (order instanceof Error) {
      response = Response.defaultInternalError({ error: order });
      return res.status(response.code).json(response);   }

   const orders = order.map((order) => {
      const orderDto = allOrders();
      orderDto.id = order.id;
      orderDto.buyer_name = undefined;
      orderDto.total_price = order.total_price;
      orderDto.date = order. order_date;
      orderDto.status = order.OrderStatusId;
      orderDto.note = order.notes;

      return orderDto;
   });

   response = Response.defaultOK('success get orders', { orders });
   return res.status(response.code).json(response);
}

export { getAllOrderHandler };

