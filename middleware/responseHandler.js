const { response, formatValidationError } = require("../utils/helpers");

const errorHandler = (err, req, res, next) => {
  switch (err.name) {
    case "ValidationError":
      err.statusCode = 422;
      err.message = "Validation Error";
      errorData = formatValidationError(err.errors);
      break;

    default:
      err.statusCode = 500;
      err.message = err.message || "Internal Server Error";
      errorData = {};
  }

  response(res, {
    status: err.statusCode,
    message: err.message,
    data: errorData,
  });
};

const notFoundHandler = (req, res, next) => {
  response(res, {
    status: 404,
    message: "Route not found",
  });
};

module.exports = [errorHandler, notFoundHandler];
