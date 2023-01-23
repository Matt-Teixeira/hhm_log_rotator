("use strict");
require("dotenv").config();
const crypto = require("crypto");
const { log } = require("./logger");
const { initRedis, cachedFileSize } = require("./redis");
const { getSystemConfig_v_1 } = require("./sql/qf-provider");

const runJob = async (jobId, redisClient, systems) => {
  try {
    await log("info", jobId, "sme", "runJob", "FN CALL");

    for await (const system of systems) {
      for await (const fileConfig of system.hhm_file_config) {
        const key = `${system.id}.${fileConfig.file_name}`;
        const fileSize = await cachedFileSize(jobId, redisClient, key);
        console.log(fileSize);
      }
    }

    await redisClient.quit();
  } catch (error) {
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
    await log("error", jobId, "NA", "onBoot", "FN CATCH", {
      error: error,
    });
  }
};

onBoot();
