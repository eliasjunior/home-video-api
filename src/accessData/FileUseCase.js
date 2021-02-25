import {
  verifyingOrphanFiles,
  getFilesFolder,
  filterValidFiles,
  getFolderName,
  isThereVideoFile,
} from "./FileHelper";
import { mapMedia } from "./MediaMapper";
import { logE } from "../common/MessageUtil";
import { DEFAULT_ENCONDING } from "../common/AppServerContant";

export default function FileUseCase({ FileApi }) {
  const { readDirectory, isDirExist, fileExtEqual, readFile } = FileApi;
  return {
    getFileDirInfo: function (fullPath) {
      return FileApi.readFileInfo(fullPath);
    },
    readFile({ absolutPath, encondig = DEFAULT_ENCONDING, logError = true }) {
      try {
        return readFile(absolutPath, encondig);
      } catch (err) {
        logE(`Unable to read file ${absolutPath}: `, logError ? err : "");
      }
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
              // reuse getValidFileList for the files in the folder
              const containVideo =
                getValidFileList(folderName).filter((fileName) =>
                  isThereVideoFile(fileName, fileExtEqual)
                ).length > 0;
              if (containVideo) {
                const folderFiles = getValidFileList(folderName);
                const media = mapMedia(folderFiles, folderName, fileExtEqual);
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
