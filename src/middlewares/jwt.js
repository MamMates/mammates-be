import jwt from 'jsonwebtoken';
import { Account } from '../models/index.js';

const createToken = (payload) => {
  const secret = process.env.SIGNKEY;
  const result = jwt.sign(payload, secret);
  return result;
};

const verifyToken = async (token, requiredRole) => {
  const secret = process.env.SIGNKEY;
  let decodedToken;

  try {
    decodedToken = jwt.verify(token, secret);
  } catch (error) {
    return false;
  }

  const res = await Account.findByPk(decodedToken.id);

  // 3 means both seller and buyer can access
  if ((decodedToken.role !== requiredRole && decodedToken.rule !== 3) || res == null) {
    return false;
  }

  return true;
};

export { createToken, verifyToken };
