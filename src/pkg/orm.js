import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
  },
);

// const sequelize = new Sequelize({
//   dialect: 'mysql',
//   dialectOptions: {
//     socketPath: '/cloudsql/mammates:us-central1:mammates',
//   },
//   database: 'mammates',
//   username: 'mammates',
//   password: 'MamMates2023',
// });

export default sequelize;
