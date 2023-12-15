import express from 'express';
import { verifyToken } from '../middlewares/index.js';
import { updatePasswordHandler } from '../controller/index.js';

const passwordRouter = express.Router();

passwordRouter.put('', verifyToken(3), updatePasswordHandler);

export default passwordRouter;
