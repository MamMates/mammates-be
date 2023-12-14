import Response from '../dto/responses/index.js';

const fileUploadError = (err, req, res, next) => {
  const response = Response.defaultBadRequest({ error: err.message });
  res.status(response.code).json(response);
};

export default fileUploadError;
