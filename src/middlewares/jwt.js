import jwt, { decode } from 'jsonwebtoken';
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
// console.log(createToken({ id: 'iudsfsfuidfsa', role: 1 }));
console.log(
  await verifyToken(
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Iml1ZHNmc2Z1aWRmc2EiLCJyb2xlIjoxLCJpYXQiOjE3MDIzNTIyMTZ9.Cf-HRLTl1DB4a6H6ZbRtrQlGkxmJkKdsxcwNpcrOcAY',
    1,
  ),
);
