const jwt = require("jsonwebtoken");
const { response } = require("../utils/helpers");

module.exports = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  try {
    if (token == null) throw new Error("Empty token");
    const result = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.data = result;
    next();
  } catch (error) {
    next(error);
  }
};
