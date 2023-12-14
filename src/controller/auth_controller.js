import {
  sellerRegisterValidator,
  loginValidator,
} from '../validators/index.js';
import {
  Account,
  Merchant,
} from '../models/index.js';
import {
  sequelize,
  parseAddress,
  registerAccount,
  loginAccount,
} from '../pkg/index.js';
import { createToken } from '../middlewares/index.js';
import Response from '../dto/responses/index.js';

const sellerRegisterHandler = async (req, res) => {
  let response;
  const reqBody = req.body;

  const reqError = sellerRegisterValidator(reqBody);
  if (reqError.length !== 0) {
    response = Response.defaultBadRequest({ errors: reqError });
    return res.status(response.code).json(response);
  }

  const parsedAdress = await parseAddress(reqBody.address);
  if (!parsedAdress) {
    response = Response.defaultBadRequest({ error: 'insert more specifict address' });
    return res.status(response.code).json(response);
  }

  const registerStatus = await registerAccount(reqBody.email, reqBody.password);
  if (registerStatus.error != null) {
    response = Response.defaultConflict({ error: registerStatus.error });
    return res.status(response.code).json(response);
  }

  const accountTransaction = async (t) => {
    await Account.create({
      id: registerStatus.uid,
      email: reqBody.email,
      RoleId: 1,
    }, { transaction: t });
    await Merchant.create({
      store: reqBody.store,
      seller: reqBody.seller,
      line: parsedAdress.line,
      subdistrict: parsedAdress.subdistrict,
      city: parsedAdress.city,
      province: parsedAdress.province,
      AccountId: registerStatus.uid,
    }, { transaction: t });
  };
  await sequelize.transaction(accountTransaction)
    .catch((error) => {
      response = Response.defaultInternalError({ error });
      return res.status(response.code).json(response);
    });

  response = Response.defaultCreated('register success', null);
  return res.status(response.code).json(response);
};

const loginHandler = async (req, res) => {
  const reqBody = req.body;
  let response;

  const reqError = loginValidator(reqBody);
  if (reqError.length !== 0) {
    response = Response.defaultBadRequest({ errors: reqError });
    return res.status(response.code).json(response);
  }

  const loginStatus = await loginAccount(reqBody.email, reqBody.password);

  if (!loginStatus.verified || loginStatus.error != null) {
    response = Response.defaultNotFound(null);
    return res.status(response.code).json(response);
  }

  const account = await Account.findByPk(loginStatus.uid);
  const jwt = createToken({ role: account.RoleId, id: loginStatus.uid });

  res.setHeader('Authorization', jwt);
  response = Response.defaultOK('login success', null);
  return res.status(response.code).json(response);
};

export { sellerRegisterHandler, loginHandler };
