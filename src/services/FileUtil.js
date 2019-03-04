const fs = require('fs');
const { VALID_FORMATS } = require('../AppServerContant')

function readFolder(videosLocation) {
    const FIRST_INDEX = 0;
    const items = fs.readdirSync(`${videosLocation}`);
    return items.filter(name => name.indexOf('.') !== FIRST_INDEX)
}

function getFileDirInfo(fullPath) {
    //get file info, size
    try {
        return fs.statSync(`${fullPath}`)
    } catch (error) {
        throw Error(error)
    }
}
function getFiles({ baseLocation, videosLocation }) {
    const filepath = baseLocation + videosLocation;
    const folders = readFolder(filepath);

    const createFolderWithFiles = (prev, folderName) => {
        const onlyValidFilesFormat = name => VALID_FORMATS.get(name.slice(-3))
        prev[folderName] = readFolder(`${filepath}/${folderName}`).filter(onlyValidFilesFormat);
        return prev;
    };
    return folders.reduce(createFolderWithFiles, {});
}
module.exports = {
    readFolder,
    getFileDirInfo,
    getFiles
}