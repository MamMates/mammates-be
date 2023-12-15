import Joi from 'joi';
import getErrorList from './error_list.js';

const reportValidator = (body) => {
  const report = Joi.object({
    name: Joi.string()
      .min(1)
      .required(),
    price: Joi.number()
      .min(1)
      .required(),
    rating: Joi.number()
      .min(1)
      .required(),
  });

  const error = report.validate(body);
  return getErrorList(error);
};

export default reportValidator;
