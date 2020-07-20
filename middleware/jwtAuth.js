const jwt = require("jsonwebtoken");
const { BadRequestError, UnauthorizedError } = require("../utils/helpers/error");

module.exports = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  try {
    if (token == null) throw new BadRequestError("Empty token");
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, data) => {
      if (err) throw new UnauthorizedError(err.message);
      req.user = data;
    });
    next();
  } catch (error) {
    next(error);
  }
};
