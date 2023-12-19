import Joi from 'joi';
import getErrorList from './error_list.js';

const createOrderValidator = (body) => {
  const food = Joi.object({
    food_id: Joi.number()
      .integer()
      .min(1)
      .required(),
    quantity: Joi.number()
      .integer()
      .min(1)
      .required(),
  });
  const order = Joi.object({
    seller_id: Joi.number()
      .integer()
      .min(1)
      .required(),
    foods: Joi.array()
      .min(1)
      .items(food)
      .required(),
  });

  const error = order.validate(body, { abortEarly: false });
  return getErrorList(error);
};

export default createOrderValidator;
