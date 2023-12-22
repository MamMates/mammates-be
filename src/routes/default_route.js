import express from 'express';

const defaultRouter = express.Router();

defaultRouter.get('', (req, res) => {
  res.redirect('https://mammates.my.id');
});

export default defaultRouter;
