const { log } = require("../logger");
const execReadFileSize = require("../read/exec-readFileSize");

async function getCurrentFileSize(sme, exec_path, file_path, file) {
  try {
    await log("info", "NA", sme, "getCurrentFileSize", "FN CALL");

    const currentFileSize = await execReadFileSize(
      exec_path,
      `${file_path}/${file}`
    );

    return currentFileSize;
  } catch (error) {
    await log("error", "NA", sme, "getCurrentFileSize", "FN CALL", {
      error: error,
    });
  }
}

module.exports = getCurrentFileSize;
