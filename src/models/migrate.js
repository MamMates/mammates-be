import { sequelize } from '../pkg/index.js';
import createMaster from './create_master.js';
import './model_relations.js';

const initialMigrate = async () => {
  try {
    await sequelize.sync({ force: false });
    await createMaster();
  } catch (error) {
    return error;
  }
  return true;
};

export default initialMigrate;
