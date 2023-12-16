import authRouter from './auth_route.js';
import foodRouter from './food_route.js';
import passwordRouter from './password_route.js';
import reportRouter from './report_route.js';
import sellerAccountRouter from './seller_account_route.js';

const injectApp = (app) => {
  app.use('/auth', authRouter);
  app.use('/foods', foodRouter);
  app.use('/accounts', sellerAccountRouter);
  app.use('/password', passwordRouter);
  app.use('/reports', reportRouter);
  return app;
};

export default injectApp;