import express from 'express';

const startServer = () => {
  const app = express();
  app.listen(process.env.PORT);
};

export default startServer;
