import express from 'express';

const app = express();
app.use(express.json());

const startServer = (appInject) => {
  appInject.listen(process.env.PORT);
};

export { app, startServer };
