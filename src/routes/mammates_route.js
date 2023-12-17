import express from 'express';
import multer from 'multer';
import { fileUploadError, verifyToken } from '../middlewares/index.js';
import { mammatesHandler } from '../controller/index.js';

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

const mamMatesUpload = upload.single('image');
const mamMatesRouter = express.Router();

mamMatesRouter.post('', verifyToken(1), mamMatesUpload, mammatesHandler);

mamMatesRouter.use(fileUploadError);

export default mamMatesRouter;
