import Joi from 'joi';
import getErrorList from './error_list.js';

const passwordValidator = (body) => {
  const password = Joi.object({
    old_password: Joi.string()
      .min(8)
      .required(),
    new_password: Joi.string()
      .min(8)
      .required(),
    new_password_repeat: Joi.ref('new_password'),
  }).with('new_password', 'new_password_repeat');

  const error = password.validate(body);
  return getErrorList(error);
};

export default passwordValidator;
