exports.handleResponse = (res, statusCode = 200, message, data, dataName) => {
  const responseBody = { message };
  data && (responseBody[dataName || "data"] = data);
  res.status(statusCode).json(responseBody);
};

exports.responseError = (message = "Error", statusCode = 404, data) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  if (data) {
    error.data = data;
  }
  throw error;
};

exports.serviceErrorHandler = (err) => {
  const error = new Error(err);
  err.statusCode && (error.statusCode = err.statusCode);
  throw error;
};
