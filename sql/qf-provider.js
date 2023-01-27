const db = require("../db/pgPool");
const { log } = require("../logger");
const { system_config } = require("./sql");

// GENERIC LOGGER FOR ANY QF CALL
const logQf = async (uuid, fn, qfArgs) => {
  await log("info", uuid, "sme", fn, `FN CALL`, {
    qfArgs: qfArgs,
  });
};

const getSystemConfig = async (uuid, args) => {
  await logQf(uuid, "getSystemConfig", "sme");
  return db.any(system_config.system_config, args);
};

module.exports = { getSystemConfig };
