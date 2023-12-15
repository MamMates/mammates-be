import express from 'express';
import multer from 'multer';
import { fileUploadError, verifyToken } from '../middlewares/index.js';
import { getStoreDetailHandler, getSellerAccountHandler, updateSellerDetailHandler } from '../controller/index.js';

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

sellerAccountRouter.use(fileUploadError);

export default sellerAccountRouter;
