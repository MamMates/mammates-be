import sequelize from '../pkg/orm.js';
import { Role, OrderStatus, FoodCategory } from './model_relations.js';

const createMaster = async () => {
  const masterTransaction = async (t) => {
    await Role.bulkCreate([
      { id: 1, name: 'Seller' },
      { id: 2, name: 'Buyer' },
    ], { transaction: t });

    await OrderStatus.bulkCreate([
      { id: 0, name: 'Rejected' },
      { id: 1, name: 'Unconfirmed' },
      { id: 2, name: 'Confirmed' },
      { id: 3, name: 'Finished' },
    ], { transaction: t });

    await FoodCategory.bulkCreate([
      { id: 0, name: 'Bika Ambon' },
      { id: 1, name: 'Dadar Gulung' },
      { id: 2, name: 'Donat' },
      { id: 3, name: 'Kue Cubit' },
      { id: 4, name: 'Kue Klepon' },
      { id: 5, name: 'Lue Lapis' },
      { id: 6, name: 'Kue Lumpur' },
      { id: 7, name: 'Kue Risoles' },
      { id: 8, name: 'Putu Ayu' },
      { id: 9, name: 'Roti' },
    ], { transaction: t });
  };

  sequelize
    .transaction(masterTransaction)
    .then(() => true)
    .catch(() => false);
};

export default createMaster;
