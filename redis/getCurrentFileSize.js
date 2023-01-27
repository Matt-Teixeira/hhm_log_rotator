const { log } = require("../logger");
const execReadFileSize = require("../read/exec-readFileSize");

async function getCurrentFileSize(sme, exec_path, file_path, file) {
  try {
    await log("info", "NA", sme, "getCurrentFileSize", "FN CALL");

    let currentFileSize = await execReadFileSize(
      exec_path,
      `${file_path}/${file}`
    );

    // If file does not exist in dir, stdout returns new line character '\n'. Set size to null
    if (currentFileSize === "\n") {
      await log("warn", "NA", sme, "getCurrentFileSize", "FN CALL", {
        message: "File not found in dir",
      });
      currentFileSize = null;
      return currentFileSize;
    }

    currentFileSize = parseInt(currentFileSize);

    return currentFileSize;
  } catch (error) {
    console.log(error);
    await log("error", "NA", sme, "getCurrentFileSize", "FN CALL", {
      error: error,
    });
  }
}

module.exports = getCurrentFileSize;
