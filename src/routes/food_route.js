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
  findFoodsHandler,
} from '../controller/index.js';
import { Customer, Food, Merchant } from '../models/model_definitions.js';
import Response from '../dto/responses/default_response.js';
import { findFoods } from '../dto/requests/food_dto.js';

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
foodRouter.get('/recommendation', verifyToken(2), async (req, res) => {
  let response;
  const { decodedToken } = res.locals;

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

  const urlEndpoint = `${process.env.ML_RECOMMENDATION}?user_id=${customer.id}`;
  let fetchResult = await fetch(urlEndpoint)
    .then((result) => result)
    .catch((error) => {
      response = Response.defaultInternalError({ error });
      return res.status(response.code).json(response);
    });

  if (!fetchResult.ok || fetchResult.status !== 200) {
    response = Response.defaultBadRequest({ error: (await fetchResult.json()).message });
    return res.status(response.code).json(response);
  }

  fetchResult = await fetchResult.json();
  fetchResult = fetchResult.data.food_id;

  const rawFoods = await Food.findAll({
    where: {
      id: { [Op.or]: fetchResult },
    },
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

  response = Response.defaultOK('success get foods recommendation', { foods });
  return res.status(response.code).json(response);
});

foodRouter.use(fileUploadError);

export default foodRouter;
