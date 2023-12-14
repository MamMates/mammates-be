import { sequelize } from '../pkg/index.js';
import {
  role,
  account,
  merchant,
  food,
  foodCategory,
  order,
  orderStatus,
  orderDetail,
  transaction,
  report,
} from './model_raw.js';

const Account = sequelize.define(
  account.name,
  account.attributes,
  account.options,
);
const Role = sequelize.define(
  role.name,
  role.attributes,
  role.options,
);
const Merchant = sequelize.define(
  merchant.name,
  merchant.attributes,
  merchant.options,
);
const Food = sequelize.define(
  food.name,
  food.attributes,
  food.options,
);
const FoodCategory = sequelize.define(
  foodCategory.name,
  foodCategory.attributes,
  foodCategory.options,
);
const Order = sequelize.define(
  order.name,
  order.attributes,
  order.options,
);
const OrderStatus = sequelize.define(
  orderStatus.name,
  orderStatus.attributes,
  orderStatus.options,
);
const OrderDetail = sequelize.define(
  orderDetail.name,
  orderDetail.attributes,
  orderDetail.options,
);
const Transaction = sequelize.define(
  transaction.name,
  transaction.attributes,
  transaction.options,
);

const Report = sequelize.define(
  report.name,
  report.attributes,
  report.options,
);

export {
  Account,
  Role,
  Merchant,
  Food,
  FoodCategory,
  Order,
  OrderDetail,
  OrderStatus,
  Transaction,
  Report,
};
