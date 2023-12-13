import { sellerRegisterValidator } from '../validators/index.js';
import { registerAccount } from '../pkg/firebase.js';
import { Account, Merchant } from '../models/index.js';
import parseAddress from '../pkg/geocode.js';
import Response from '../dto/responses/default_response.js';
import sequelize from '../pkg/orm.js';

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
    await Account.create({ id: registerStatus.uid, RoleId: 1 }, { transaction: t });
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

export default sellerRegisterHandler;
