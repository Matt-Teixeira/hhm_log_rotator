const { log } = require("../logger");
const {
  cachedFileSize,
  getCurrentFileSize,
  resetRedisCachedValue,
} = require("../redis");

const reset_redis = async (jobId, redisClient, systems) => {
    const fileSizePath = "./read/sh/readFileSize.sh";
  try {
    await log("info", jobId, "sme", "reset_redis", "FN CALL");

    // Loop through array of various systems
    for await (const system of systems) {
        // Some systems have multiple files and referances to redis. Loop through each file
      for await (const fileConfig of system.hhm_file_config) {
        const key = `${system.id}.${fileConfig.file_name}`;
        const cacheFileSize = await cachedFileSize(
          jobId,
          system.id,
          redisClient,
          key
        );

        console.log(typeof cacheFileSize + " : " + cacheFileSize);

        // Get Current File Size
        const currentFileSize = await getCurrentFileSize(
          system.id,
          fileSizePath,
          system.hhm_config.file_path,
          fileConfig.file_name
        );

        console.log(typeof currentFileSize + " : " + currentFileSize);

        // Ran at mignight
        // If current file size is === to redis value, we are up to date on what has been parsed and can set redis back to "0"
        if (currentFileSize - cacheFileSize === 0 && currentFileSize !== null) {
            await resetRedisCachedValue(
                jobId,
                redisClient,
                system.id,
                fileConfig.file_name
              );
        } else{
            await log("warn", jobId, "sme", system.id, "FN CALL", {message: "Unable to reset redis cache", file: fileConfig.file_name, currentFileSize, cacheFileSize});
        }
      }
    }
  } catch (error) {
    await log("ERROR", jobId, "sme", "reset_redis", "FN CALL", {
      error,
    });
    await redisClient.quit();
  }
};

module.exports = reset_redis;
