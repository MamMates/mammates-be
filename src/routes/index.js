import authRouter from './auth_route.js';
import foodRouter from './food_route.js';

const injectApp = (app) => {
  app.use('/auth', authRouter);
  app.use('/foods', foodRouter);
  return app;
};

export default injectApp;
