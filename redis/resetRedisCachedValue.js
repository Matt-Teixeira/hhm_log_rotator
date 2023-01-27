("use strict");
require("dotenv").config();
const { log } = require("../logger");

const resetRedisCachedValue = async (jobId, redisClient, sme, file) => {
  try {
    await log("info", jobId, sme, "resetRedisCachedValue", "FN CALL");

    const setKey = `${sme}.${file}`;

    await redisClient.set(setKey, 0);
  } catch (error) {
    redisClient
    await log("error", jobId, sme, "resetRedisCachedValue", "FN CALL");
  }
};

module.exports = resetRedisCachedValue;
