import authRouter from './auth_route.js';

const injectApp = (app) => {
  app.use('/auth', authRouter);
  return app;
};

export default injectApp;
