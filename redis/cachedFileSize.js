("use strict");
require("dotenv").config();
const { log } = require("../logger");

const cachedFileSize = async (jobId, sme, redisClient, key) => {
  try {
    await log("info", jobId, sme, "cachedFileSize", `FN CALL`);
    const fileSize = await redisClient.get(key);
    return fileSize;
  } catch (error) {
    await redisClient.quit();
    await log("error", jobId, sme, "onBoot", "FN CATCH", {
      error: error,
    });
  }
};

module.exports = cachedFileSize;
