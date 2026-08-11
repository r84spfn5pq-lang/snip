const { URL } = require("url");

function getConnectionOptions() {
  const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";
  const parsed = new URL(redisUrl);

  return {
    host: parsed.hostname,
    port: Number(parsed.port) || 6379,
  };
}

module.exports = { getConnectionOptions };
