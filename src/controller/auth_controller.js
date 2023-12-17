import { v4 as uuidv4 } from 'uuid';
import {
  sellerRegisterValidator,
  buyerRegisterValidator,
  loginValidator,
} from '../validators/index.js';
import {
  Account,
  Merchant,
  Customer,
} from '../models/index.js';
import {
  sequelize,
  parseAddress,
} from '../pkg/index.js';
import { createToken } from '../middlewares/index.js';
import Response from '../dto/responses/index.js';
import { checkBcrypt, createBcrypt } from '../utils/index.js';

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

  const userId = uuidv4();
  const password = await createBcrypt(reqBody.password);

  const accountTransaction = async (t) => {
    await Account.create({
      id: userId,
      email: reqBody.email,
      password,
      RoleId: 1,
    }, { transaction: t });
    await Merchant.create({
      store: reqBody.store,
      seller: reqBody.seller,
      line: parsedAdress.line,
      subdistrict: parsedAdress.subdistrict,
      city: parsedAdress.city,
      province: parsedAdress.province,
      AccountId: userId,
    }, { transaction: t });
  };
  await sequelize.transaction(accountTransaction)
    .catch((error) => {
      response = Response.defaultConflict({ error });
      return res.status(response.code).json(response);
    });

  response = Response.defaultCreated('register success', null);
  return res.status(response.code).json(response);
};

const buyerRegisterHandler = async (req, res) => {
  let response;
  const reqBody = req.body;

  const reqError = buyerRegisterValidator(reqBody);
  if (reqError.length !== 0) {
    response = Response.defaultBadRequest({ errors: reqError });
    return res.status(response.code).json(response);
  }

  const userId = uuidv4();
  const password = await createBcrypt(reqBody.password);

  const accountTransaction = async (t) => {
    await Account.create({
      id: userId,
      email: reqBody.email,
      password,
      RoleId: 2,
    }, { transaction: t });
    await Customer.create({
      name: reqBody.name,
      AccountId: userId,
    }, { transaction: t });
  };
  await sequelize.transaction(accountTransaction)
    .catch((error) => {
      response = Response.defaultConflict({ error });
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

  const account = await Account.findOne({
    where: {
      email: reqBody.email,
    },
  })
    .catch(() => {
      response = Response.defaultInternalError(null);
      return res.status(response.code).json(response);
    });

  if (!account) {
    response = Response.defaultNotFound(null);
    return res.status(response.code).json(response);
  }

  const verifiedPass = await checkBcrypt(account.password, reqBody.password);
  if (!verifiedPass) {
    response = Response.defaultNotFound(null);
    return res.status(response.code).json(response);
  }

  const jwt = createToken({ role: account.RoleId, id: account.id });

  res.setHeader('Authorization', jwt);
  response = Response.defaultOK('login success', null);
  return res.status(response.code).json(response);
};

export {
  sellerRegisterHandler,
  buyerRegisterHandler,
  loginHandler,
};
