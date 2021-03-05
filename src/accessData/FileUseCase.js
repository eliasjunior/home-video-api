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
