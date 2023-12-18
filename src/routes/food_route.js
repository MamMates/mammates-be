import express from 'express';
import multer from 'multer';
import { Op } from 'sequelize';
import { fileUploadError, verifyToken } from '../middlewares/index.js';
import {
  addNewFoodHandler,
  deleteSingleFood,
  getAllFoodsHandler,
  getSingleFoodHandler,
  updateSingleFoodHandler,
} from '../controller/index.js';
import { Food, Merchant } from '../models/index.js';
import Response from '../dto/responses/default_response.js';
import { findFoods } from '../dto/requests/index.js';

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

foodRouter.get('/find', verifyToken(2), async (req, res) => {
  let response;
  const reqQuery = req.query;

  if (!reqQuery.q) {
    response = Response.defaultBadRequest({ error: 'Query must be provided' });
    return res.status(response.code).json(response);
  }

  const foodCondition = {
    name: {
      [Op.substring]: reqQuery.q,
    },
  };
  if (reqQuery.c) foodCondition.FoodCategoryId = reqQuery.c;
  if (reqQuery.s) foodCondition.MerchantId = reqQuery.s;

  const rawFoods = await Food.findAll({
    where: foodCondition,
    attributes: ['id', 'name', 'rating', 'price', 'image', 'last_photo', 'updatedAt', 'FoodCategoryId'],
    include: {
      model: Merchant,
      attributes: ['id', 'store', 'line', 'subdistrict', 'city', 'province'],
    },
  });

  const foods = rawFoods.reduce((result, food) => {
    const now = new Date();
    const lastUpdateDate = new Date(food.updatedAt);
    const prefixLink = 'https://storage.googleapis.com/';
    const suffixLink = '?ignoreCache=1';

    if ((now - lastUpdateDate) / 3_600_000 <= process.env.VALID_FOOD_DURATION) {
      const findFoodDto = findFoods();
      findFoodDto.id = food.id;
      findFoodDto.name = food.name;
      findFoodDto.price = food.price;
      findFoodDto.mam_rates = food.rating;
      findFoodDto.image = food.image !== null
        ? `${prefixLink}${process.env.BUCKET_NAME}/${food.image}${suffixLink}`
        : `${prefixLink}${process.env.BUCKET_NAME}/${food.last_photo}${suffixLink}`;

      const merchant = food.Merchant;
      findFoodDto.seller.id = merchant.id;
      findFoodDto.seller.name = merchant.store;
      findFoodDto.seller.address = `${merchant.line}, ${merchant.subdistrict}, ${merchant.city}, ${merchant.province}`;

      result.push(findFoodDto);
    }
    return result;
  }, []);

  response = Response.defaultOK('success get foods', { foods });
  return res.status(response.code).send(response);
});

foodRouter.use(fileUploadError);

export default foodRouter;
