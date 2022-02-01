const Ioredis = require("ioredis");

const redisClient = new Ioredis(process.env.REDIS_CONNECTION_URI+"?allowUsernameInURI=true");

module.exports = redisClient;
