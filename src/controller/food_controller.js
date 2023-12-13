import { foodValidator } from '../validators/index.js';
import { Food, Merchant } from '../models/index.js';
import Response from '../dto/responses/index.js';
import createFilename from '../utils/index.js';
import uploadFileToBucket from '../pkg/storage.js';
import sequelize from '../pkg/orm.js';
import allFoods from '../dto/requests/index.js';

const addNewFoodHandler = async (req, res) => {
  let response;
  const reqBody = req.body;
  const reqFiles = req.files;

  const reqError = foodValidator(reqBody);
  if (reqError.length !== 0) {
    response = Response.defaultBadRequest({ errors: reqError });
    return res.status(response.code).json(response);
  }

  const mamImageName = createFilename('mam_images/', reqFiles.mam_image[0].originalname);
  let thumbnailName = null;
  if (reqFiles.image && typeof reqFiles.image === 'object') {
    thumbnailName = createFilename('thumbnails/', reqFiles.image[0].originalname);
  }

  const { decodedToken } = res.locals;
  const insertFood = async (t) => {
    const merchant = await Merchant.findOne({
      where: {
        AccountId: decodedToken.id,
      },
    }, { transaction: t });

    await Food.create({
      name: reqBody.name,
      price: reqBody.price,
      rating: reqBody.mam_rates,
      image: thumbnailName === null ? null : thumbnailName,
      last_photo: mamImageName,
      FoodCategoryId: reqBody.category,
      MerchantId: merchant.id,
    }, { transaction: t });
  };
  await sequelize.transaction(insertFood)
    .catch((error) => {
      response = Response.defaultInternalError({ error });
      return res.status(response.code).json(response);
    });

  await uploadFileToBucket(process.env.BUCKET_NAME, mamImageName, reqFiles.mam_image[0].buffer);
  if (thumbnailName) {
    await uploadFileToBucket(process.env.BUCKET_NAME, thumbnailName, reqFiles.image[0].buffer);
  }

  response = Response.defaultOK('new food added successfully', null);
  return res.status(response.code).json(response);
};

const getAllFoodsHandler = async (req, res) => {
  let response;
  const { decodedToken } = res.locals;

  const merchantFoods = await Merchant.findOne({
    where: {
      AccountId: decodedToken.id,
    },
    include: {
      model: Food,
      attributes: ['id', 'name', 'price', 'rating', 'image', 'last_photo', 'updatedAt'],
    },
  })
    .then((merchant) => {
      const foods = merchant.Food;
      return foods;
    })
    .catch((error) => {
      const err = new Error(error);
      return err;
    });

  if (merchantFoods instanceof Error) {
    response = Response.defaultInternalError({ error: merchantFoods });
    return res.status(response.code).json(response);
  }

  const foods = merchantFoods.map((food) => {
    const foodDto = allFoods();
    const prefixLink = 'https://storage.googleapis.com/';
    const now = new Date();
    const lastUpdateDate = new Date(food.updatedAt);
    foodDto.id = food.id;
    foodDto.name = food.name;
    foodDto.price = food.price;
    foodDto.mam_rates = food.rating;
    foodDto.image = food.image !== null
      ? `${prefixLink}${process.env.BUCKET_NAME}/${food.image}`
      : `${prefixLink}${process.env.BUCKET_NAME}/${food.last_photo}`;
    foodDto.is_valid = (now - lastUpdateDate) / 3_600_000 <= process.env.VALID_FOOD_DURATION;

    return foodDto;
  });

  response = Response.defaultOK('success get foods', { foods });
  return res.status(response.code).json(response);
};

export { addNewFoodHandler, getAllFoodsHandler };
