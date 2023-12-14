import {
  sellerRegisterHandler,
  loginHandler,
} from './auth_controller.js';
import {
  addNewFoodHandler,
  getAllFoodsHandler,
  getSingleFoodHandler,
  updateSingleFoodHandler,
  deleteSingleFood,
} from './food_controller.js';
import { getStoreDetailHandler, getSellerAccountHandler } from './seller_account_controller.js';

export {
  sellerRegisterHandler,
  loginHandler,
  addNewFoodHandler,
  getAllFoodsHandler,
  getSingleFoodHandler,
  updateSingleFoodHandler,
  deleteSingleFood,
  getStoreDetailHandler,
  getSellerAccountHandler,
};
