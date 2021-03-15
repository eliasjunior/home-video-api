import {
  verifyingOrphanFiles,
  getFilesFolder,
  filterValidFiles,
  getFolderName,
  isThereVideoFile,
} from "./FileHelper";
import { mapMedia } from "./MediaMapper";
import { logD, logE } from "../common/MessageUtil";
import { DEFAULT_ENCONDING } from "../common/AppServerConstant";

export default function FileUseCase({ FileApi }) {
  const { readDirectory, isDirExist, fileExtEqual, readFile } = FileApi;
  return {
    getFileDirInfo: function (fullPath) {
      try {
        return FileApi.readFileInfo(fullPath);
      } catch (error) {
        logE(`Unable to read file information ${fullPath}: `);
        throw error;
      }
    },
    readFile({ absolutePath, encoding = DEFAULT_ENCONDING, logError = true }) {
      try {
        return readFile(absolutePath, encoding);
      } catch (err) {
        logD(`Unable to read file ${absolutePath}: `, logError ? err : "");
      }
    },
    getFiles: function ({ baseLocation }) {
      //It just goes 1 level in the folder
      if (isDirExist(baseLocation)) {
        console.info(`getFiles under *** ${baseLocation} ***`);
        verifyingOrphanFiles(baseLocation, { readDirectory, fileExtEqual });
        // get all folders including the ones that does not have video
        const allFolders = getFolderName(baseLocation, { readDirectory });
        const loadFiles = (folderName) =>  getFilesFolder(
          `${baseLocation}/${folderName}`,
          readDirectory
        );
        const getValidFileList = (folderName) => {
           // video, subtitles, img
          return filterValidFiles(loadFiles(folderName), fileExtEqual);
        };
        const onlyFolderWithValidFiles = (folderName) => getValidFileList(folderName).length > 0;
        // reuse getValidFileList for the files in the folder
        const isThereAVideoInFolder = (folderName) =>  getValidFileList(folderName).filter((fileName) =>
        isThereVideoFile(fileName, fileExtEqual)
        ).length > 0
        const buildUpFoldersTable =  (prev, folderName) => {
          const files = loadFiles(folderName);
          const media = mapMedia(files, folderName, fileExtEqual);
          prev.byId[folderName] = media;
          prev.allIds.push(media.id);
          return prev;
        }
        return allFolders
          .filter(onlyFolderWithValidFiles)
          .filter(isThereAVideoInFolder)
          .reduce(buildUpFoldersTable, { byId: {}, allIds: [] }
          );
      } else {
        console.info(`Dir ${baseLocation} does not exist`);
        return { byId: {}, allIds: [] };
      }
    },
    getFileExt(fileName) {
      return fileExtEqual(fileName);
    },
  };
}
