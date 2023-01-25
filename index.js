("use strict");
require("dotenv").config();
const crypto = require("crypto");
const { log } = require("./logger");
const {
  initRedis,
  cachedFileSize,
  getCurrentFileSize,
  resetRedisCachedValue,
} = require("./redis");
const { getSystemConfig_v_1 } = require("./sql/qf-provider");
const execRotateFile = require("./read/exec-rotateFile");

const runJob = async (jobId, redisClient, systems) => {
  try {
    await log("info", jobId, "sme", "runJob", "FN CALL");

    const fileSizePath = "./read/sh/readFileSize.sh";
    const rotateFilePath = "./read/sh/rotateLog.sh";
    const s = process.env.SUDO;

    for await (const system of systems) {
      for await (const fileConfig of system.hhm_file_config) {
        const key = `${system.id}.${fileConfig.file_name}`;
        const cacheFileSize = await cachedFileSize(jobId, system.id, redisClient, key);

        // Get Current File Size
        const currentFileSize = await getCurrentFileSize(
          system.id,
          fileSizePath,
          system.hhm_config.file_path,
          fileConfig.file_name
        );

        // Compare file sizes. If no differance, set redis to 0 && rotate file in Debian;
        if (currentFileSize - cacheFileSize === 0) {
          // Reset redis cache
          resetRedisCachedValue(
            jobId,
            redisClient,
            system.id,
            fileConfig.file_name
          );

          // Rotate File
          const datetime_now = new Date().toISOString()
          const complete_file_path = `${system.hhm_config.file_path}/${fileConfig.file_name}`;
          const copy_file_path = `${system.hhm_config.file_path}/archive/${fileConfig.file_name}_${datetime_now}`;
        
          execRotateFile(jobId, rotateFilePath, complete_file_path, copy_file_path, s);
          
        }
      }
    }

    await redisClient.quit();
  } catch (error) {
    console.log(error);
    // Close connection in event of error
    await redisClient.quit();
    await log("error", jobId, "sme", "runJob", "FN CATCH", {
      error: error,
    });
  }
};

const onBoot = async () => {
  let jobId = crypto.randomUUID();
  try {
    await log("info", jobId, "sme", "onBoot", `FN CALL`);

    const redisClient = await initRedis();

    const systems = await getSystemConfig_v_1(jobId, '"v_1"');

    await runJob(jobId, redisClient, systems);
  } catch (error) {
    console.log(error);
    await log("error", jobId, "NA", "onBoot", "FN CATCH", {
      error: error,
    });
  }
};

onBoot();
