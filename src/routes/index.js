import authRouter from './auth_route.js';
import foodRouter from './food_route.js';
import passwordRouter from './password_route.js';
import reportRouter from './report_route.js';
import accountRouter from './account_route.js';
import mamMatesRouter from './mammates_route.js';
import orderRouter from './order_route.js';
import defaultRouter from './default_route.js';
import { notFound } from '../middlewares/index.js';

const injectApp = (app) => {
  app.use('/auth', authRouter);
  app.use('/foods', foodRouter);
  app.use('/accounts', accountRouter);
  app.use('/password', passwordRouter);
  app.use('/reports', reportRouter);
  app.use('/mam_mates', mamMatesRouter);
  app.use('/orders', orderRouter);
  app.use('/', defaultRouter);
  app.use(notFound);
  return app;
};

export default injectApp;
