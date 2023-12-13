import Joi from 'joi';
import getErrorList from './error_list.js';

const sellerRegisterValidator = (body) => {
  const sellerRegister = Joi.object({
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
    password: Joi.string()
      .min(8)
      .required(),
    password_repeat: Joi.ref('password'),
  })
    .with('password', 'password_repeat');

  const error = sellerRegister.validate(body, { abortEarly: false });
  return getErrorList(error);
};

const loginValidator = (body) => {
  const login = Joi.object({
    email: Joi.string()
      .email()
      .required(),
    password: Joi.string()
      .min(8)
      .required(),
  });

  const error = login.validate(body, { abortEarly: false });
  return getErrorList(error);
};

export { sellerRegisterValidator, loginValidator };
