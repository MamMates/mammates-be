import jwt from 'jsonwebtoken';
import { Account } from '../models/index.js';
import Response from '../dto/responses/index.js';

const createToken = (payload) => {
  const secret = process.env.SIGNKEY;
  const result = jwt.sign(payload, secret);
  return result;
};

const verifyToken = (requiredRole) => {
  const middlewareProcess = async (req, res, next) => {
    const secret = process.env.SIGNKEY;
    let response;

    let decodedToken;
    let token = req.get('Authorization').split(' ');
    token = token[token.length - 1];

    try {
      decodedToken = jwt.verify(token, secret);
    } catch (error) {
      response = Response.defaultUnauthorized({ error });
      return res.status(response.code).json(response);
    }

    const account = await Account.findByPk(decodedToken.id);

    // 3 means both seller and buyer can access
    if ((decodedToken.role !== requiredRole && requiredRole !== 3) || account === null) {
      response = Response.defaultForbidden({ error: 'forbidden access' });
      return res.status(response.code).json(response);
    }
    res.locals.decodedToken = decodedToken;

    return next();
  };
  return middlewareProcess;
};

export { createToken, verifyToken };
