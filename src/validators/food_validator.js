import Joi from 'joi';
import getErrorList from './error_list.js';

const foodValidator = (body) => {
  const food = Joi.object({
    name: Joi.string()
      .min(1)
      .required(),
    category: Joi.number()
      .min(0)
      .required(),
    price: Joi.number()
      .required(),
    mam_rates: Joi.number()
      .min(0)
      .required(),
    image: Joi.string()
      .empty(),
  });

  const error = food.validate(body, { abortEarly: false });
  return getErrorList(error);
};

export default foodValidator;
