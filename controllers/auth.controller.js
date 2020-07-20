const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const client = require("../config/client");
const { response } = require("../utils/helpers");
const { BadRequestError, ValidationError, UnauthorizedError } = require("../utils/helpers/error");

const generateAccessToken = (data) => {
  return jwt.sign(data, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRE });
};

module.exports = {
  store: async (req, res, next) => {
    try {
      let data = await User.create(req.body);
      response(res, { status: 200, data: data });
    } catch (error) {
      next(error);
    }
  },
  login: async (req, res, next) => {
    try {
      let user = await User.validateUser(req.body);
      if (user == null) throw new ValidationError("Wrong Username / Password");

      const accessToken = generateAccessToken(user);
      const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);

      // add the refresh token to redis
      await client.saddAsync(`token:${user.username}`, refreshToken);
      response(res, { status: 200, data: { accessToken, refreshToken } });
    } catch (error) {
      next(error);
    }
  },
  refreshToken: async (req, res, next) => {
    const { token, username } = req.body;

    try {
      if (token == null || username == null) throw new BadRequestError("Token / Username Not Found");

      // check if the token is exist on redis
      let reply = await client.sismemberAsync(`token:${username}`, token);
      if (reply < 1) throw new UnauthorizedError("Token / Username Not Valid");
      jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, data) => {
        if (err) throw new UnauthorizedError(err.message);
        const accessToken = generateAccessToken({ username: data.username, role: data.role });
        response(res, { data: { accessToken } });
      });
    } catch (error) {
      next(error);
    }
  },
  logout: async (req, res) => {
    const { token, username } = req.body;

    try {
      if (token == null || username == null) throw new BadRequestError("Token / Username Not Found");

      // remove token from redis
      await client.sremAsync(`token:${username}`, token);
      response(res, { message: "Logout" });
    } catch (error) {
      next(error);
    }
  },
};
