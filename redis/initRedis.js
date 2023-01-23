("use strict");
require("dotenv").config();
const { log } = require("../logger");
const redis = require("redis");

async function initRedis() {
  try {
    // SETUP ENV BASED RESOURCES -> REDIS CLIENT, JOB SCHEDULES
    const clienConfig = {
      socket: {
        port: 6379,
        host: process.env.REDIS_IP,
      },
    };

    const redisClient = redis.createClient(clienConfig);

    redisClient.on(
      "error",
      async (error) =>
        await log("error", "NA", "NA", "redisClient", `ON ERROR`, {
          // TODO: KILL APP?
          error: error,
        })
    );

    await redisClient.connect();

    return redisClient;
  } catch (error) {
    await log("error", "NA", "NA", "redisClient", `ON ERROR`, {
      error: error,
    });
  }
}

module.exports = initRedis;
