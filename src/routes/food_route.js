import express from 'express';
import multer from 'multer';
import { fileUploadError, verifyToken } from '../middlewares/index.js';
import {
  addNewFoodHandler,
  getAllFoodsHandler,
  getSingleFoodHandler,
} from '../controller/index.js';
import { foodValidator } from '../validators/index.js';
import { Food, FoodCategory, Merchant } from '../models/index.js';
import uploadFileToBucket from '../pkg/storage.js';
import createFilename from '../utils/index.js';
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

const foodUpload = upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'mam_image', maxCount: 1 },
]);

const foodRouter = express.Router();

foodRouter.post('/', verifyToken(1), foodUpload, addNewFoodHandler);
foodRouter.get('/', verifyToken(1), getAllFoodsHandler);
foodRouter.get('/:foodId', verifyToken(1), getSingleFoodHandler);
foodRouter.put('/:foodId', verifyToken(1), foodUpload, async (req, res) => {
  let response;
  const { foodId } = req.params;
  const { decodedToken } = res.locals;
  const reqBody = req.body;
  const reqFiles = req.files;

  const reqError = foodValidator(reqBody);
  if (reqError.length !== 0) {
    response = Response.defaultBadRequest({ errors: reqError });
    return res.status(response.code).json(response);
  }

  if (foodId <= 0) {
    response = Response.defaultBadRequest({ error: 'request params error' });
    return res.status(response.code).json(response);
  }

  const currentFood = await Merchant.findOne({
    where: {
      AccountId: decodedToken.id,
    },
    include: {
      model: Food,
      where: {
        id: foodId,
      },
    },
  })
    .then((merchant) => merchant.Food[0])
    .catch((error) => {
      const err = new Error(error);
      return err;
    });

  if (currentFood instanceof Error) {
    response = Response.defaultNotFound(null);
    return res.status(response.code).json(response);
  }

  currentFood.name = reqBody.name;
  currentFood.FoodCategoryId = reqBody.category;
  currentFood.price = reqBody.price;
  currentFood.rating = reqBody.mam_rates;
  let thumbnailName = null;
  if (currentFood.image === null && reqFiles.image && typeof reqFiles.image === 'object') {
    thumbnailName = createFilename('thumbnails/', reqFiles.image[0].originalname);
    currentFood.image = thumbnailName;
  }
  await currentFood.save();

  await uploadFileToBucket(
    process.env.BUCKET_NAME,
    currentFood.last_photo,
    reqFiles.mam_image[0].buffer,
  );
  if (reqFiles.image && typeof reqFiles.image === 'object') {
    await uploadFileToBucket(
      process.env.BUCKET_NAME,
      currentFood.image,
      reqFiles.image[0].buffer,
    );
  }

  response = Response.defaultOK('food updated successfully', null);
  return res.status(response.code).json(response);
});

foodRouter.use(fileUploadError);

export default foodRouter;
