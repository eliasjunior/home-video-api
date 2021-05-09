/* eslint-disable no-useless-catch */
import fs from "fs";
import path from "path";
import { logE, logD } from "../common/MessageUtil";
import { DEFAULT_ENCODING } from "../common/AppServerConstant";

export default function FileLib() {
  return {
    readFileInfo: function (fullPath) {
      //get file info, size
      try {
        return fs.statSync(`${fullPath}`);
      } catch (err) {
        throw err;
      }
    },
    readDirectory: function (folderLocation) {
      try {
        return fs.readdirSync(folderLocation, { withFileTypes: true });
      } catch (err) {
        logE("Unable to scan directory: " + err);
        logD(`No directories found into ${folderLocation}`);
      }
      return [];
    },
    readFile: function (fileUrl, encoding = DEFAULT_ENCODING) {
      try {
        if (encoding === "none") {
          return fs.readFileSync(fileUrl);
        } else {
          return fs.readFileSync(fileUrl, encoding);
        }
      } catch (err) {
        throw err;
      }
    },
    isDirExist: function (folderPath) {
      try {
        fs.accessSync(folderPath, fs.constants.R_OK | fs.constants.F_OK);
        return true;
      } catch (err) {
        logE(`${folderPath} does not exist or cannot access it`, err);
        return false;
      }
    },
    fileExtEqual: function (fileName) {
      return path.extname(fileName).toLowerCase();
    },
  };
}
