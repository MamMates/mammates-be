import express from 'express';
import multer from 'multer';
import { fileUploadError, verifyToken } from '../middlewares/index.js';
import {
  addNewFoodHandler,
  deleteSingleFood,
  getAllFoodsHandler,
  getSingleFoodHandler,
  updateSingleFoodHandler,
  findFoodsHandler,
  getFoodRecommendationHandler,
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

const foodUpload = upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'mam_image', maxCount: 1 },
]);

const foodRouter = express.Router();

foodRouter.post('/', verifyToken(1), foodUpload, addNewFoodHandler);
foodRouter.get('/', verifyToken(1), getAllFoodsHandler);
foodRouter.get('/:foodId(\\d+)', verifyToken(1), getSingleFoodHandler);
foodRouter.put('/:foodId', verifyToken(1), foodUpload, updateSingleFoodHandler);
foodRouter.delete('/:foodId', verifyToken(1), deleteSingleFood);

foodRouter.get('/find', verifyToken(2), findFoodsHandler);
foodRouter.get('/recommendation', verifyToken(2), getFoodRecommendationHandler);

foodRouter.use(fileUploadError);

export default foodRouter;
