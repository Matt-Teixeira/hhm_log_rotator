const { QueryFile } = require("pg-promise");
const { join: joinPath } = require("path");

const sql = (file) => {
  const fullPath = joinPath(__dirname, file);
  return new QueryFile(fullPath, { minify: true });
};

module.exports = {
  system_config: {
    system_config_v_1: sql("queries/getSystemConfig_v_1.sql")
  }
};
