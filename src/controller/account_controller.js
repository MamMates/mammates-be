import { Account, Merchant, Customer } from '../models/index.js';
import Response from '../dto/responses/index.js';
import { storeDetail, sellerAccount, buyerAccount } from '../dto/requests/index.js';
import { sellerUpdateValidator, buyerUpdateValidator } from '../validators/index.js';
import { parseAddress, sequelize } from '../pkg/index.js';
import { createFilename } from '../utils/index.js';
import uploadFileToBucket from '../pkg/storage.js';

const getStoreDetailHandler = async (req, res) => {
  let response;
  const { decodedToken } = res.locals;

  const merchant = await Merchant.findOne({
    where: {
      AccountId: decodedToken.id,
    },
  });
  if (!merchant) {
    response = Response.defaultNotFound(null);
    return res.status(response.code).json(response);
  }

  const prefixLink = 'https://storage.googleapis.com/';
  const store = storeDetail();
  store.name = merchant.store;
  store.address = `${merchant.line}, ${merchant.subdistrict}, ${merchant.city}, ${merchant.province}`;
  store.image = merchant.image !== null ? `${prefixLink}${process.env.BUCKET_NAME}/${merchant.image}` : null;

  response = Response.defaultOK('success get store detail', { store });
  return res.status(response.code).json(response);
};

const getSellerAccountHandler = async (req, res) => {
  let response;
  const { decodedToken } = res.locals;

  const merchant = await Merchant.findOne({
    where: {
      AccountId: decodedToken.id,
    },
    include: Account,
  });
  if (!merchant) {
    response = Response.defaultNotFound(null);
    return res.status(response.code).json(response);
  }

  const prefixLink = 'https://storage.googleapis.com/';
  const account = sellerAccount();
  account.store = merchant.store;
  account.address = `${merchant.line}, ${merchant.subdistrict}, ${merchant.city}, ${merchant.province}`;
  account.seller = merchant.seller;
  account.email = merchant.Account.email;
  account.image = merchant.image !== null ? `${prefixLink}${process.env.BUCKET_NAME}/${merchant.image}` : null;

  response = Response.defaultOK('success get seller account', { account });
  return res.status(response.code).json(response);
};

const updateSellerDetailHandler = async (req, res) => {
  let response;
  const { decodedToken } = res.locals;
  const reqBody = req.body;

  const reqError = sellerUpdateValidator(reqBody);
  if (reqError.length !== 0) {
    response = Response.defaultBadRequest({ errors: reqError });
    return res.status(response.code).json(response);
  }

  const parsedAdress = await parseAddress(reqBody.address);
  if (!parsedAdress) {
    response = Response.defaultBadRequest({ error: 'insert more specifict address' });
    return res.status(response.code).json(response);
  }

  const merchant = await Merchant.findOne({
    where: {
      AccountId: decodedToken.id,
    },
    include: Account,
  }).catch((error) => {
    const err = new Error(error);
    return err;
  });

  if (merchant instanceof Error) {
    response = Response.defaultNotFound(null);
    return res.status(response.code).json(response);
  }

  const account = merchant.Account;
  merchant.store = reqBody.store;
  merchant.seller = reqBody.seller;
  merchant.line = parsedAdress.line;
  merchant.subdistrict = parsedAdress.subdistrict;
  merchant.city = parsedAdress.city;
  merchant.province = parsedAdress.province;
  account.email = reqBody.email;

  const updateTransaction = async (t) => {
    await merchant.save({ transaction: t });
    await account.save({ trancaction: t });
  };
  await sequelize.transaction(updateTransaction)
    .catch((error) => {
      response = Response.defaultInternalError({ error });
      return res.status(response.code).json(response);
    });

  response = Response.defaultOK('seller updated successfully');
  return res.status(response.code).json(response);
};

const updateSellerProfilePictureHandler = async (req, res) => {
  let response;
  const { decodedToken } = res.locals;
  const reqFile = req.file;

  if (!reqFile) {
    response = Response.defaultBadRequest({ error: 'make sure image included' });
    return res.status(response.code).json(response);
  }

  const merchant = await Merchant.findOne({
    where: {
      AccountId: decodedToken.id,
    },
  })
    .catch((error) => {
      const err = new Error(error);
      return err;
    });

  if (merchant instanceof Error) {
    response = Response.defaultNotFound(null);
    return res.status(response.code).json(response);
  }

  let profileName = merchant.image;
  if (profileName === null) {
    profileName = createFilename('profiles/', reqFile.originalname);
  }

  await merchant.update({ image: profileName });
  await uploadFileToBucket(process.env.BUCKET_NAME, profileName, reqFile.buffer);

  response = Response.defaultOK('profile picture updated successfully', null);
  return res.status(response.code).json(response);
};

const getBuyerAccountHandler = async (req, res) => {
  let response;
  const { decodedToken } = res.locals;

  const customer = await Customer.findOne({
    where: {
      AccountId: decodedToken.id,
    },
    include: Account,
  });
  if (!customer) {
    response = Response.defaultNotFound(null);
    return res.status(response.code).json(response);
  }

  const prefixLink = 'https://storage.googleapis.com/';
  const suffixLink = '?ignoreCache=1';
  const account = buyerAccount();
  account.name = customer.name;
  account.email = customer.Account.email;
  account.image = customer.image !== null ? `${prefixLink}${process.env.BUCKET_NAME}/${customer.image}${suffixLink}` : null;

  response = Response.defaultOK('success get buyer account', { account });
  return res.status(response.code).json(response);
};

const updateBuyerAccountHandler = async (req, res) => {
  let response;
  const { decodedToken } = res.locals;
  const reqBody = req.body;

  const reqError = buyerUpdateValidator(reqBody);
  if (reqError.length !== 0) {
    response = Response.defaultBadRequest({ errors: reqError });
    return res.status(response.code).json(response);
  }

  const customer = await Customer.findOne({
    where: {
      AccountId: decodedToken.id,
    },
    include: Account,
  })
    .catch((error) => {
      const err = new Error(error);
      return err;
    });

  if (customer instanceof Error) {
    response = Response.defaultNotFound(null);
    return res.status(response.code).json(response);
  }

  const account = customer.Account;
  customer.name = reqBody.name;
  account.email = reqBody.email;

  const updateTransaction = async (t) => {
    await customer.save({ transaction: t });
    await account.save({ trancaction: t });
  };
  await sequelize.transaction(updateTransaction)
    .catch((error) => {
      response = Response.defaultInternalError({ error });
      return res.status(response.code).json(response);
    });

  response = Response.defaultOK('buyer updated successfully');
  return res.status(response.code).json(response);
};

export {
  getStoreDetailHandler,
  getSellerAccountHandler,
  updateSellerDetailHandler,
  updateSellerProfilePictureHandler,
  getBuyerAccountHandler,
  updateBuyerAccountHandler,
};
