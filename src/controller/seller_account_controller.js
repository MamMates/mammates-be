import { Merchant } from '../models/index.js';
import Response from '../dto/responses/index.js';
import { storeDetail } from '../dto/requests/index.js';

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

const holder = null;

export { getStoreDetailHandler, holder };
