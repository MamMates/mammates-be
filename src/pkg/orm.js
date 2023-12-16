import { Sequelize } from 'sequelize';

// const sequelize = new Sequelize(
//   process.env.DB_NAME,
//   process.env.DB_USER,
//   process.env.DB_PASS,
//   {
//     host: process.env.DB_HOST,
//     dialect: 'mysql',
//   },
// );

const connectionString = `mysql://${process.env.DB_USER}:`
  + `${process.env.DB_PASS}@`
  + `${process.env.DB_HOST}/`
  + `${process.env.DB_NAME}`
  + `?socketPath=${process.env.SOCKET_PATH}${process.env.CONNECTION_NAME}`;
const sequelize = new Sequelize(connectionString);

export default sequelize;
