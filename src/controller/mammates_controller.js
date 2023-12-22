import fetch, { File } from 'node-fetch';
import { Merchant } from '../models/index.js';
import Response from '../dto/responses/index.js';

const mammatesHandler = async (req, res) => {
  let response;
  const { decodedToken } = res.locals;
  const reqFile = req.file;

  if (!reqFile) {
    response = Response.defaultBadRequest({ error: 'make sure image included' });
    return res.status(response.code).json(response);
  }

  const merchant = await Merchant.findOne({
    attributes: ['province'],
    where: {
      AccountId: decodedToken.id,
    },
  }).catch((error) => {
    const err = new Error(error);
    return err;
  });

  if (merchant instanceof Error) {
    response = Response.defaultNotFound(null);
    return res.status(response.code).json(response);
  }

  const urlEndpoint = `${process.env.ML_PREDICTION}?province=${merchant.province.toLowerCase()}`;
  const formData = new FormData();
  const image = new File([reqFile.buffer], reqFile.originalname, { type: 'image/jpg' });
  formData.set('image', image, reqFile.originalname);

  let fetchResult = await fetch(urlEndpoint, {
    method: 'POST',
    body: formData,
  })
    .then((result) => result)
    .catch((error) => {
      response = Response.defaultInternalError({ error });
      return res.status(response.code).json(response);
    });

  if (!fetchResult.ok || fetchResult.status !== 200) {
    response = Response.defaultBadRequest({ error: await fetchResult.json() });
    return res.status(response.code).json(response);
  }

  fetchResult = await fetchResult.json();
  response = Response.defaultOK('success get MamMates', { mam_mates: fetchResult.data });
  return res.status(response.code).json(response);
};

export default mammatesHandler;
