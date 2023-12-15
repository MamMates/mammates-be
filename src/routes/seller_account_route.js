import express from 'express';
import multer from 'multer';
import { fileUploadError, verifyToken } from '../middlewares/index.js';
import { getStoreDetailHandler, getSellerAccountHandler } from '../controller/index.js';
import { sellerUpdateValidator } from '../validators/index.js';
import { Account, Merchant } from '../models/model_definitions.js';
import { parseAddress, sequelize } from '../pkg/index.js';
import Response from '../dto/responses/default_response.js';

const upload = multer({
  limits: {
    fileSize: 2000000,
  },
  fileFilter: (req, file, cb) => {
    const validMimeType = [
      'image/jpeg',
      'image/webp',
      'image/png',
      'image/bmp',
    ];
    if (!validMimeType.includes(file.mimetype)) {
      cb(new Error('invalid file type'), false);
    }
    cb(null, true);
  },
  storage: multer.memoryStorage(),
});

const profileUpload = upload.single('image');
const sellerAccountRouter = express.Router();

sellerAccountRouter.get('/store', verifyToken(1), getStoreDetailHandler);
sellerAccountRouter.get('/seller', verifyToken(1), getSellerAccountHandler);
sellerAccountRouter.put('/seller', verifyToken(1), async (req, res) => {
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
});

sellerAccountRouter.use(fileUploadError);

export default sellerAccountRouter;
