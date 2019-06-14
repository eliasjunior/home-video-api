import fs from 'fs';
/**
 * @param {string} path - is the absolute path to where the files is located 
 */
export function readSyncFile(path) {
  return fs.readdirSync(path);
}
export function fileInfo(file) {
  return fs.statSync(file)
}
export async function readFile(path, callback) {
  return await fs.readdir(path, callback);
}
export function getFileInfo(path) {
  try {
    return fs.statSync(path)
  } catch (error) {
    throw Error(error)
  }
}
