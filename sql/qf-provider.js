const db = require("../db/pgPool");
const { log } = require("../logger");
const { system_config } = require("./sql");

// GENERIC LOGGER FOR ANY QF CALL
const logQf = async (uuid, fn, qfArgs) => {
  await log("info", uuid, "sme", fn, `FN CALL`, {
    qfArgs: qfArgs,
  });
};

const getSystemConfig_v_1 = async (uuid, args) => {
  await logQf(uuid, "getSystemIpAddress", "sme");
  return db.any(system_config.system_config_v_1, args);
};

module.exports = { getSystemConfig_v_1 };
