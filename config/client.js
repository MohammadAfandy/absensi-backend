const redis = require("redis");
const REDIS_HOST = process.env.REDIS_HOST || "127.0.0.1";
const REDIS_PORT = process.env.REDIS_PORT || 6379;
const REDIS_PASSWORD = process.env.REDIS_PASSWORD || "";
const client = redis.createClient({ host: REDIS_HOST, port: REDIS_PORT, auth_pass: REDIS_PASSWORD });

client.on("connect", function () {
  console.log(`redis connected on ${REDIS_HOST} port ${REDIS_PORT}`);
});

module.exports = client;
