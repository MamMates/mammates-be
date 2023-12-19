import express from 'express';
import multer from 'multer';
import { fileUploadError, verifyToken } from '../middlewares/index.js';
import {
  getStoreDetailHandler,
  getSellerAccountHandler,
  updateSellerDetailHandler,
  updateSellerProfilePictureHandler,
  getBuyerAccountHandler,
  updateBuyerAccountHandler,
} from '../controller/index.js';
import { Customer } from '../models/model_definitions.js';
import createFilename from '../utils/filename.js';
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
const accountRouter = express.Router();

accountRouter.get('/store', verifyToken(1), getStoreDetailHandler);
accountRouter.get('/seller', verifyToken(1), getSellerAccountHandler);
accountRouter.put('/seller', verifyToken(1), updateSellerDetailHandler);
accountRouter.patch('/seller', verifyToken(1), profileUpload, updateSellerProfilePictureHandler);

accountRouter.get('/buyer', verifyToken(2), getBuyerAccountHandler);
accountRouter.put('/buyer', verifyToken(2), updateBuyerAccountHandler);
accountRouter.patch('/buyer', verifyToken(2), profileUpload, async (req, res) => {
  let response;
  const { decodedToken } = res.locals;
  const reqFile = req.file;

  if (!reqFile) {
    response = Response.defaultBadRequest({ error: 'make sure image included' });
    return res.status(response.code).json(response);
  }

  const customer = await Customer.findOne({
    where: {
      AccountId: decodedToken.id,
    },
  })
    .catch((error) => {
      const err = new Error(error);
      return err;
    });

  if (customer instanceof Error) {
    response = Response.defaultNotFound(null);
    return res.status(response.code).json(response);
  }

  let profileImage = customer.image;
  if (profileImage === null) {
    profileImage = createFilename('profiles/', reqFile.originalname);
  }

  await customer.update({ image: profileImage });
  await uploadFileToBucket(process.env.BUCKET_NAME, profileImage, reqFile.buffer);

  response = Response.defaultOK('profile picture updated successfully', null);
  return res.status(response.code).json(response);
});

accountRouter.use(fileUploadError);

export default accountRouter;
