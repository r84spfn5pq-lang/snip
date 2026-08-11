require("dotenv").config();

const { Worker } = require("bullmq");
const { getConnectionOptions } = require("./lib/redisConfig");
const store = require("./lib/store");
const redis = require("./lib/redisClient");

const worker = new Worker(
  "clicks",
  async (job) => {
    const { code } = job.data;
    const updated = store.incrementClicks(code);

    if (!updated) {
      console.warn(`Worker: got a click job for unknown code "${code}", skipping.`);
      return;
    }

    await redis.publish("linkClicked", JSON.stringify({ code: updated.code, clicks: updated.clicks }));
    console.log(`Worker: recorded a click for /${code} (now ${updated.clicks})`);
  },
  { connection: getConnectionOptions() }
);

worker.on("failed", (job, err) => {
  console.error(`Worker: job ${job.id} failed:`, err.message);
});

console.log("Snip worker is running, waiting for click jobs...");
