const { log } = require("../logger");
const {
  cachedFileSize,
  getCurrentFileSize,
  resetRedisCachedValue,
} = require("../redis");
const execRotateFile = require("../read/exec-rotateFile");

const rotate_logs_redis = async (jobId, redisClient, systems) => {
  try {
    await log("info", jobId, "sme", "rotate_logs_redis", "FN CALL");

    const fileSizePath = "./read/sh/readFileSize.sh";
    const rotateFilePath = "./read/sh/rotateLog.sh";
    const s = process.env.SUDO;

    for await (const system of systems) {
      for await (const fileConfig of system.hhm_file_config) {
        const key = `${system.id}.${fileConfig.file_name}`;
        const cacheFileSize = await cachedFileSize(
          jobId,
          system.id,
          redisClient,
          key
        );

        // Stop running app if there is not cached file data. Need to run rpp for this system.
        if (cacheFileSize === null) {
          await log("warn", jobId, system.id, "rotate_logs_redis", "FN CALL", {
            message: "No cached file data. Need to run rpp for this system",
          });
          break;
        } else if (cacheFileSize === 0) {
          await log("warn", jobId, system.id, "rotate_logs_redis", "FN CALL", {
            message: "Cached file size is 0. Need to run rpp for this system",
          });
          break;
        }

        // Get Current File Size
        const currentFileSize = await getCurrentFileSize(
          system.id,
          fileSizePath,
          system.hhm_config.file_path,
          fileConfig.file_name
        );

        console.log(system.id + ": " + currentFileSize);
        console.log("Cached File Size: " + cacheFileSize);

        // Compare file sizes. If no differance, set redis to 0 && rotate file in Debian;
        if (currentFileSize - cacheFileSize === 0 && currentFileSize !== null) {
          console.log("INSIDE operations");
          // Rotate File
          const datetime_now = new Date().toISOString();
          const complete_file_path = `${system.hhm_config.file_path}/${fileConfig.file_name}`;
          const copy_file_path = `${system.hhm_config.file_path}/archive/${fileConfig.file_name}_${datetime_now}`;

          const fileIsRotated = await execRotateFile(
            jobId,
            system.id,
            rotateFilePath,
            complete_file_path,
            copy_file_path,
            s
          );

          if (fileIsRotated) {
            // Reset redis cache
            await resetRedisCachedValue(
              jobId,
              redisClient,
              system.id,
              fileConfig.file_name
            );
          }
        }
      }
    }
  } catch (error) {
    await log("ERROR", jobId, "sme", "rotate_logs_redis", "FN CALL", {
      error,
    });
    await redisClient.quit();
  }
};

module.exports = rotate_logs_redis;
