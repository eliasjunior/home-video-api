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
  const loadFiles = (folderName, baseLocation) =>
    getFilesFolder(`${baseLocation}/${folderName}`, readDirectory);
  const getValidFileList = (folderName, baseLocation) => {
    // video, subtitles, img
    return filterValidFiles(loadFiles(folderName, baseLocation), fileExtEqual);
  };
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
    getSeries: function ({ baseLocation }) {
      console.info(`getSeries under === ${baseLocation} ===`);
      const allFolders = getFolderName(baseLocation, {
        readDirectory,
      });
      return allFolders.reduce(
        (prev, folderName) => {
          const files = getValidFileList(folderName, baseLocation)
          const media = mapMedia({files, folderName, fileExtEqual, isFolder: true});
          prev.byId[folderName] = media;
          prev.allIds.push(folderName);
          return prev;
        },
        { byId: {}, allIds: [] }
      );
    },
    //TODO need test for this one
    getVideos: function ({ baseLocation }) {
      //It just goes 1 level in the folder
      if (isDirExist(baseLocation)) {
        console.info(`getVideos under *** ${baseLocation} ***`);
        verifyingOrphanFiles(baseLocation, { readDirectory, fileExtEqual });
        // get all folders including the ones that does not have video
        const allFolders = getFolderName(baseLocation, { readDirectory });
        
        const onlyFolderWithValidFiles = (folderName) =>
          getValidFileList(folderName, baseLocation).length > 0;
        // reuse getValidFileList for the files in the folder
        const isThereAVideoInFolder = (folderName) =>
          getValidFileList(folderName, baseLocation).filter((fileName) =>
            isThereVideoFile(fileName, fileExtEqual)
          ).length > 0;
        const buildUpFoldersTable = (prev, folderName) => {
          const files = loadFiles(folderName, baseLocation);
          const media = mapMedia({files, folderName, fileExtEqual});
          prev.byId[folderName] = media;
          prev.allIds.push(media.id);
          return prev;
        };
        return allFolders
          .filter(onlyFolderWithValidFiles)
          .filter(isThereAVideoInFolder)
          .reduce(buildUpFoldersTable, { byId: {}, allIds: [] });
      } else {
        return { byId: {}, allIds: [] };
      }
    },
    getFileExt(fileName) {
      return fileExtEqual(fileName);
    },
  };
}
