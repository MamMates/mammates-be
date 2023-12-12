import express from 'express';

const app = express();

const startServer = (appInject) => {
  appInject.listen(process.env.PORT);
};

export { app, startServer };
