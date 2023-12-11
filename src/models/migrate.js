import { sequelize } from '../pkg/index.js';
import './model_relations.js';

const initialMigrate = async () => {
  try {
    await sequelize.sync({ force: false });
    sequelize.close();
  } catch (error) {
    return error;
  }
  return true;
};

export default initialMigrate;
