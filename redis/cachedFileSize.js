("use strict");
require("dotenv").config();
const { log } = require("../logger");

const cachedFileSize = async (jobId, redisClient, key) => {
  try {
    await log("info", jobId, "sme", "onBoot", `FN CALL`);
    const fileSize = await redisClient.get(key);
    return fileSize;
  } catch (error) {
    await redisClient.quit();
    await log("error", jobId, "NA", "onBoot", "FN CATCH", {
      error: error,
    });
  }
};

module.exports = cachedFileSize;
