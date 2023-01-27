("use strict");
require("dotenv").config();
const { log } = require("../logger");

const cachedFileSize = async (jobId, sme, redisClient, key) => {
  try {
    await log("info", jobId, sme, "cachedFileSize", `FN CALL`);
    let fileSize = await redisClient.get(key);
    
    // Will return null if redis entry not present i.e. new system
    if (fileSize !== null) {
      fileSize = parseInt(fileSize);
    }
    return fileSize;
  } catch (error) {
    await redisClient.quit();
    await log("error", jobId, sme, "onBoot", "FN CATCH", {
      error: error,
    });
  }
};

module.exports = cachedFileSize;
