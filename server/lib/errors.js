const createError = (message, statusCode = 500) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const notFoundError = (message = "Record not found") =>
  createError(message, 404);

module.exports = {
  createError,
  notFoundError,
};
