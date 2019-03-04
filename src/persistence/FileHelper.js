const fs = require('fs');

/**
 * @param {string} path - is the absolute path to where the files is located 
 */
function readSyncFile(path) {
  return fs.readdirSync(path);
}

function getFileInfo(path) {
  try {
    return fs.statSync(path)
  } catch (error) {
    throw Error(error)
  }
}

module.exports = {
  readSyncFile,
  getFileInfo
}