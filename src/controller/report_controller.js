import { reportValidator } from '../validators/index.js';
import { createFilename } from '../utils/index.js';
import { Report } from '../models/index.js';
import Response from '../dto/responses/default_response.js';
import { uploadFileToBucket } from '../pkg/index.js';

const createReportHandler = async (req, res) => {
  let response;
  const reqBody = req.body;
  const reqFile = req.file;

  const reqError = reportValidator(reqBody);
  if (reqError.length !== 0) {
    response = Response.defaultBadRequest({ errors: reqError });
    return res.status(response.code).json(response);
  }
  if (!reqFile) {
    response = Response.defaultBadRequest({ error: 'make sure image included' });
    return res.status(response.code).json(response);
  }

  const imageName = createFilename('reports/', reqFile.originalname);
  await Report.create({
    name: reqBody.name,
    price: reqBody.price,
    rating: reqBody.rating,
    image: imageName,
  })
    .catch((error) => {
      response = Response.defaultInternalError({ error });
      return res.status(response.code).json(response);
    });

  await uploadFileToBucket(process.env.BUCKET_NAME, imageName, reqFile.buffer);

  response = Response.defaultOK('report created successfully', null);
  return res.status(response.code).json(response);
};

export default createReportHandler;
