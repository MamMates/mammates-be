import Response from '../dto/responses/index.js';

const notFound = (req, res) => {
  const response = Response.defaultNotFound({ something_fun: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' });
  res.status(response.code).json(response);
};

export default notFound;
