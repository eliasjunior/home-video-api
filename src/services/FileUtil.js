const fs = require('fs');
const { VALID_FORMATS } = require('../AppServerContant')

function readFolder(videosLocation) {
    const FIRST_INDEX = 0;
    const dirents = fs.readdirSync(videosLocation, { withFileTypes: true });
    
    fs.readdir(videosLocation, function (err, files) {
    //handling error
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        } 
        //listing all files using forEach
        files.forEach(function (file) {
            // Do whatever you want to do with the file
            
            fs.access(file, fs.constants.R_OK, err => {
                console.log(`${err ? "is not readable" : "******** is readable"} ${file} `);
            });
        });
    });
    
     const items = dirents
         .filter(dirent => dirent.isDirectory())
         .map(dirent => dirent.name);
     //const items = fs.readdirSync(`${videosLocation}`);
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
//TODO: delete if it not using
function filterFiles(fileName) {
    const info = getFileDirInfo(`${videosLocation}/${name}`)
    console.log(info.isFile());

    if (info.isFile()) {
        return
    } else {
        return items.filter(name => name.indexOf('DS_Store') !== 0)
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
