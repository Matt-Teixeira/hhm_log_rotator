const { log } = require("../logger");
const util = require("util");
const execFile = util.promisify(require("node:child_process").execFile);

async function execRotateFile(
  jobId,
  exec_path,
  complete_file_path,
  copy_file_path,
  s
) {
  const execOptions = {
    maxBuffer: 1024 * 1024 * 10,
  };

  await log("info", jobId, "sme", "execRotateFile", "FN CALL", {
    file: complete_file_path,
  });

  try {
    const { stdout: newData } = await execFile(
      exec_path,
      [complete_file_path, copy_file_path, s],
      execOptions
    );
    console.log(complete_file_path + " " + copy_file_path);
    return newData;
  } catch (error) {
    await log("error", jobId, "sme", "execRotateFile", "FN CALL", {
      file: complete_file_path,
    });
    return null;
  }
}

module.exports = execRotateFile;
