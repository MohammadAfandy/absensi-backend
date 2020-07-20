const { response, formatValidationError } = require("./index");
const mongoose = require("mongoose");

class NotFoundError extends Error {
  constructor(message) {
    super();
    this.name = "NotFoundError";
    this.statusCode = 404;
    this.message = message || "Not Found";
  }
}

class BadRequestError extends Error {
  constructor(message) {
    super();
    this.name = "BadRequest";
    this.statusCode = 400;
    this.message = message || "Bad Request";
  }
}

class UnauthorizedError extends Error {
  constructor(message) {
    super();
    this.name = "UnauthorizedError";
    this.statusCode = 401;
    this.message = message || "Unauthorized";
  }
}

class ForbiddenError extends Error {
  constructor(message) {
    super();
    this.name = "ForbiddenError";
    this.statusCode = 401;
    this.message = message || "Forbidden";
  }
}

class ValidationError extends Error {
  constructor(message) {
    super();
    this.name = "ValidationError";
    this.statusCode = 422;
    this.message = message || "Validation Error";
  }
}

const handleError = (err, res) => {
  errorData = {};
  if (err instanceof mongoose.Error.ValidationError) {
    err.statusCode = 422;
    errorData = formatValidationError(err.errors);
  } else if (err instanceof mongoose.Error.CastError) {
    err.statusCode = 400;
    err.message = "Invalid Object ID";
  }

  response(res, {
    status: err.statusCode || 500,
    message: err.message || "Internal Server Error",
    data: errorData,
  });
};

module.exports = {
  NotFoundError,
  ValidationError,
  ForbiddenError,
  UnauthorizedError,
  BadRequestError,
  handleError,
};
