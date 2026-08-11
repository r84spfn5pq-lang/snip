const { Queue } = require("bullmq");
const { getConnectionOptions } = require("./redisConfig");

const clicksQueue = new Queue("clicks", { connection: getConnectionOptions() });

module.exports = { clicksQueue };
