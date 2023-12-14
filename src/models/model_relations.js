import {
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
} from './model_definitions.js';

Role.hasMany(Account);
Account.belongsTo(Role, {
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

Account.hasOne(Merchant);
Merchant.belongsTo(Account, {
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

Merchant.hasMany(Food);
Food.belongsTo(Merchant, {
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

FoodCategory.hasMany(Food);
Food.belongsTo(FoodCategory, {
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

Merchant.hasMany(Order);
Order.belongsTo(Merchant, {
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

OrderStatus.hasMany(Order);
Order.belongsTo(OrderStatus, {
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
  foreignKey: {
    allowNull: false,
    defaultValue: 1,
  },
});

Order.hasMany(OrderDetail);
OrderDetail.belongsTo(Order, {
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

Food.hasMany(OrderDetail);
OrderDetail.belongsTo(Food, {
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

Order.hasOne(Transaction);
Transaction.belongsTo(Order, {
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

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
