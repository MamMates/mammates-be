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

accountRouter.use(fileUploadError);

export default accountRouter;
