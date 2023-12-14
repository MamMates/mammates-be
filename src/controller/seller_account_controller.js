import { Account, Merchant } from '../models/index.js';
import Response from '../dto/responses/index.js';
import { storeDetail, sellerAccount } from '../dto/requests/index.js';

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

export { getStoreDetailHandler, getSellerAccountHandler };
