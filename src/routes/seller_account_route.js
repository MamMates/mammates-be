import express from 'express';
import multer from 'multer';
import { fileUploadError, verifyToken } from '../middlewares/index.js';
import { getStoreDetailHandler, getSellerAccountHandler, updateSellerDetailHandler } from '../controller/index.js';
import createFilename from '../utils/filename.js';
import { Merchant } from '../models/index.js';
import uploadFileToBucket from '../pkg/storage.js';
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
sellerAccountRouter.put('/seller', verifyToken(1), updateSellerDetailHandler);
sellerAccountRouter.patch('/seller', verifyToken(1), profileUpload, async (req, res) => {
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
});

sellerAccountRouter.use(fileUploadError);

export default sellerAccountRouter;
