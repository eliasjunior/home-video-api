const { VIDEO_FORMATS } = require('../AppServerContant')


function UtilFactory() {
    return ({ApiResource}) => {
        const {
            readFileOnDisc,
            isDirExist,
            fileExtEqual
        } = ApiResource;
      return {
          getFileDirInfo: function(fullPath) {
              return ApiResource.readFileInfo(fullPath);
          },
          getFiles: function({ baseLocation }) {
              //It just goes 1 level in the folder
              if(isDirExist(baseLocation)) {
                  console.info(`getFiles under ${baseLocation}`)
                  verifyingOrphanFiles(baseLocation, {readFileOnDisc, fileExtEqual})

                  const folders = getFolderName(baseLocation, {readFileOnDisc});
                  console.info(`Folders found [${folders}]`)

                  const getOnlyValidFile = (folderName) => {
                      const fileList = getFilesFolder(`${baseLocation}/${folderName}`, readFileOnDisc)
                      return filterValidFiles(fileList, fileExtEqual);
                  }

                  return folders
                      .filter(folderName => getOnlyValidFile(folderName).length > 0)
                      .reduce( (prev, folderName) => {
                          prev[folderName] = getOnlyValidFile(folderName)
                          return prev;
                      }, {});

              } else {
                  console.info(`Dir ${baseLocation} does not exist`);
              }
          }
      }
    }
}

module.exports = UtilFactory

// ###### Private functions

function filterValidFiles (fileList, fileExtEqual){
    const isValidExtension = (fileName, fileExtEqual) => {
        return VIDEO_FORMATS.filter(ext =>  ext === fileExtEqual(fileName)).length > 0
    }
    return fileList.filter(fileName => isValidExtension(fileName, fileExtEqual))
}

function getFolderName(baseLocation, {readFileOnDisc}) {

        const fileOrFolder = readFileOnDisc(baseLocation);
        return fileOrFolder
            .filter(file => file.isDirectory())
            .map(file => file.name);
}

function verifyingOrphanFiles(baseLocation, {readFileOnDisc, fileExtEqual}) {
    const justFiles = readFileOnDisc(baseLocation)
        .filter(file => !file.isDirectory())
        .map(file => file.name)

    if(justFiles.length > 0) {
        filterValidFiles(justFiles, fileExtEqual).forEach(name => {
            console.warn(`*** ${name} does not has a parent folder`);
        });
    } else {
        console.info(`No files with ext[${permittedExtStr()}] without a parent in ${baseLocation}`)
    }
}

function permittedExtStr() {
    return VIDEO_FORMATS.reduce((prev, cur)=> {
        prev = prev.concat(cur) + ", "
        return prev;
    } , "");
}

function getFilesFolder(folderName, readFileOnDisc) {
    try {
        const fileOrFolder = readFileOnDisc(folderName);
        return fileOrFolder
            .map(file => file.name);

    } catch (err) {
        console.error('Unable to scan directory: ' + err);
        return [];
    }
}
