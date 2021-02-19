import {
  verifyingOrphanFiles,
  getFilesFolder,
  filterValidFiles,
  getFolderName,
  isThereVideoFile,
} from "./FileHelper";
import { mapMedia } from "./MediaMapper";

function UtilFactory({ ApiResource }) {
  const { readDirectory, isDirExist, fileExtEqual, readFile } = ApiResource;
  return {
    getFileDirInfo: function (fullPath) {
      return ApiResource.readFileInfo(fullPath);
    },
    readFile(absolutPath, encondig = DEFAULT_ENCONDING) {
      return readFile(absolutPath, encondig);
    },
    getFiles: function ({ baseLocation }) {
      //It just goes 1 level in the folder
      if (isDirExist(baseLocation)) {
        console.info(`getFiles under *** ${baseLocation} ***`);
        verifyingOrphanFiles(baseLocation, { readDirectory, fileExtEqual });
        // get all folders including the ones that does not have video
        const allFolders = getFolderName(baseLocation, { readDirectory });

        const getValidFileList = (folderName) => {
          const fileList = getFilesFolder(
            `${baseLocation}/${folderName}`,
            readDirectory
          );
          return filterValidFiles(fileList, fileExtEqual);
        };
        return allFolders
          .filter((folderName) => getValidFileList(folderName).length > 0)
          .reduce(
            (prev, folderName) => {
              const files = getValidFileList(folderName).filter((fileName) =>
                isThereVideoFile(fileName, fileExtEqual)
              );
              if(files.length) {
                const media = mapMedia(files, folderName, fileExtEqual );
                prev.byId[folderName] = media;
                prev.allIds.push(media.id);
              }
              return prev;
            },
            { byId: {}, allIds: [] }
          );
      } else {
        console.info(`Dir ${baseLocation} does not exist`);
      }
    },
    getFileExt(fileName) {
      return fileExtEqual(fileName);
    },
  };
}

export default UtilFactory;
