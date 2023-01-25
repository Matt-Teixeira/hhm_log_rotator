const initRedis = require("./initRedis");
const cachedFileSize = require("./cachedFileSize");
const getCurrentFileSize = require("./getCurrentFileSize");
const resetRedisCachedValue = require("./resetRedisCachedValue");

module.exports = { initRedis, cachedFileSize, getCurrentFileSize, resetRedisCachedValue };
