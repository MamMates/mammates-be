import { passwordValidator } from '../validators/index.js';
import { checkBcrypt, createBcrypt } from '../utils/index.js';
import { Account } from '../models/model_definitions.js';
import Response from '../dto/responses/default_response.js';

const updatePasswordHandler = async (req, res) => {
  let response;
  const { decodedToken } = res.locals;
  const reqBody = req.body;

  const reqError = passwordValidator(reqBody);
  if (reqError.length !== 0) {
    response = Response.defaultBadRequest({ errors: reqError });
    return res.status(response.code).json(response);
  }

  const account = await Account.findByPk(decodedToken.id)
    .catch(() => {
      response = Response.defaultNotFound(null);
      return res.status(response.code).json(response);
    });

  const verifiedPass = await checkBcrypt(account.password, reqBody.old_password);
  if (!verifiedPass) {
    response = Response.defaultUnauthorized(null);
    return res.status(response.code).json(response);
  }

  const newPassword = await createBcrypt(reqBody.new_password);
  account.password = newPassword;
  account.save();

  response = Response.defaultOK('password updated successfully', null);
  return res.status(response.code).json(response);
};

export default updatePasswordHandler;
