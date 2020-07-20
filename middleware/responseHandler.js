const { response, formatValidationError } = require("../utils/helpers");
const { handleError } = require("../utils/helpers/error");

const errorHandler = (err, req, res, next) => {
  handleError(err, res);
};

const notFoundHandler = (req, res, next) => {
  response(res, {
    status: 404,
    message: "Route not found",
  });
};

module.exports = [errorHandler, notFoundHandler];
