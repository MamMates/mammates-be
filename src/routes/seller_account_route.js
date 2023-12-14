import express from 'express';
import multer from 'multer';
import { fileUploadError, verifyToken } from '../middlewares/index.js';
import { getStoreDetailHandler } from '../controller/index.js';
import { Merchant } from '../models/model_definitions.js';
import { sellerAccount, storeDetail } from '../dto/requests/seller_account_dto.js';
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
sellerAccountRouter.get('/seller', verifyToken(1), async (req, res) => {
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
  const account = sellerAccount();
  account.store = merchant.store;
  account.address = `${merchant.line}, ${merchant.subdistrict}, ${merchant.city}, ${merchant.province}`;
  account.seller = merchant.seller;
  account.email = merchant.email;
  account.image = merchant.image !== null ? `${prefixLink}${process.env.BUCKET_NAME}/${merchant.image}` : null;
  console.log(account);
  response = Response.defaultOK('success get seller detail', { account });
  return res.status(response.code).json(response);
});

sellerAccountRouter.use(fileUploadError);

export default sellerAccountRouter;
