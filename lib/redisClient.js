const Redis = require("ioredis");
const { getConnectionOptions } = require("./redisConfig");

const redis = new Redis(getConnectionOptions());

module.exports = redis;
