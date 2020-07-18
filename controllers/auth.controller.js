const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const client = require("../config/client");
const { response } = require("../utils/helpers");

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
    let user;
    if ((user = await User.validateUser(req.body))) {
      const accessToken = generateAccessToken(user);
      const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);

      // add the token to redis
      client.sadd(`token:${user.username}`, refreshToken);
      response(res, { status: 200, data: { accessToken, refreshToken } });
    } else {
      next(new Error("Wrong Username / Password"));
    }
  },
  refreshToken: async (req, res, next) => {
    const { token, username } = req.body;

    try {
      if (token == null || username == null) throw new Error("Token / Username not found");

      // check if the token is exist on redis
      client.sismember(`token:${username}`, token, (err, reply) => {
        if (err) return next(err);
        if (reply < 1) return next(Error("Invalid Token"));

        const result = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
        const accessToken = generateAccessToken({ username: result.username, role: result.role });
        response(res, { data: { accessToken } });
      });
    } catch (error) {
      next(error);
    }
  },
  logout: (req, res) => {
    const { token, username } = req.body;

    try {
      if (token == null || username == null) throw new Error("Token / Username not found");

      // remove token from redis
      client.srem(`token:${username}`, token);
      response(res, { message: "Logout" });
    } catch (error) {
      next(error);
    }
  },
};
