import Util from "./FileUtil"

const fs = require('fs');
const path = require('path');
const EMPTY_INFO = "";

const ApiResource = {
    readFileInfo: function(fullPath) {
        //get file info, size
        try {
            return fs.statSync(`${fullPath}`)
        } catch (error) {
            console.error(error);
        }
        return EMPTY_INFO
    },
    readDirectory: function(folderLocation) {
        try {
            return fs.readdirSync(folderLocation, { withFileTypes: true });
        } catch (err) {
            console.error('Unable to scan directory: ' + err);
        }
        console.warn(`No directories found into ${folderLocation}`)
        return [];
    },
    readFile: function(fileUrl) {
        try {
            return  fs.readFileSync(fileUrl);
        } catch (err) {
            console.error(`Unable to read file${fileUrl}: `);
            throw err;
        }
    },
    isDirExist: function (folderPath) {
        try {
            fs.accessSync(folderPath, fs.constants.R_OK | fs.constants.F_OK);
            return true;
        } catch (err) {
            console.error(`${folderPath} does not exist`, err);
            return false;
        }
    },
    fileExtEqual: function(fileName) {
        return path.extname(fileName).toLowerCase();
    }
}

export default Util({ApiResource});
