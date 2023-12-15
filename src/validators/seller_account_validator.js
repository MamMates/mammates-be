import Joi from 'joi';
import getErrorList from './error_list.js';

const sellerUpdateValidator = (body) => {
  const sellerUpdate = Joi.object({
    store: Joi.string()
      .min(1)
      .required(),
    address: Joi.string()
      .min(1)
      .required(),
    seller: Joi.string()
      .min(1)
      .required(),
    email: Joi.string()
      .email()
      .required(),
  });

  const error = sellerUpdate.validate(body, { abortEarly: false });
  return getErrorList(error);
};

export default sellerUpdateValidator;
