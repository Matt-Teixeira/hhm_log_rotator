("use strict");
require("dotenv").config();
const crypto = require("crypto");
const { log } = require("./logger");
const { initRedis } = require("./redis");
const { getSystemConfig } = require("./sql/qf-provider");
const { reset_redis, rotate_logs_redis } = require("./jobs");

const runJob = async (jobId, redisClient, systems, refresh_version) => {
  try {
    await log("info", jobId, refresh_version, "runJob", "FN CALL");
    
    switch (refresh_version) {
      case "v_1":
        // Rotates log on debian and set redis key value to "0"
        await rotate_logs_redis(jobId, redisClient, systems);
        break;
      case "v_3":
        // Set redis key value to "0" only
        await reset_redis(jobId, redisClient, systems);
        break;

      default:
        break;
    }
  } catch (error) {
    console.log(error);
    await redisClient.quit();
    await log("error", jobId, "sme", "runJob", "FN CATCH", {
      error: error,
    });
  }
};

const onBoot = async () => {
  let jobId = crypto.randomUUID();
  const redisClient = await initRedis();
  try {
    const refresh_version = process.argv[2];

    await log("info", jobId, refresh_version, "onBoot", `FN CALL`);

    // get all systems who's log_rotation refresh_version === shell args (process.argv[2])
    const systems = await getSystemConfig(jobId, `"${refresh_version}"`);

    await runJob(jobId, redisClient, systems, refresh_version);

    await redisClient.quit();
  } catch (error) {
    console.log(error);
    await log("error", jobId, "NA", "onBoot", "FN CATCH", {
      error: error,
    });
    await redisClient.quit();
  }
};

onBoot();
