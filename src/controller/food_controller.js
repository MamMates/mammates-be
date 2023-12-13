import { foodValidator } from '../validators/index.js';
import { Food, Merchant } from '../models/index.js';
import Response from '../dto/responses/index.js';
import createFilename from '../utils/index.js';
import uploadFileToBucket from '../pkg/storage.js';
import sequelize from '../pkg/orm.js';

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

const holder = null;

export { addNewFoodHandler, holder };
