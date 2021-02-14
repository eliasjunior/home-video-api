import {
    verifyingOrphanFiles,
    getFilesFolder,
    filterValidFiles,
    getFolderName
} from "./FileHelper";
import {mapMedia} from "./MediaMapper";

function UtilFactory({ApiResource}) {
    const {
        readFileOnDisc,
        isDirExist,
        fileExtEqual
    } = ApiResource;
    return {
        getFileDirInfo: function (fullPath) {
            return ApiResource.readFileInfo(fullPath);
        },
        getFiles: function ({baseLocation}) {
            //It just goes 1 level in the folder
            if (isDirExist(baseLocation)) {
                console.info(`getFiles under ${baseLocation}`)
                verifyingOrphanFiles(baseLocation, {readFileOnDisc, fileExtEqual})
                // get all folders including the ones that does not have video
                const allFolders = getFolderName(baseLocation, {readFileOnDisc});

                const getOnlyValidFile = (folderName) => {
                    const fileList = getFilesFolder(`${baseLocation}/${folderName}`, readFileOnDisc)
                    return filterValidFiles(fileList, fileExtEqual);
                }
                return allFolders
                    .filter(folderName => getOnlyValidFile(folderName).length > 0)
                    .reduce((prev, folderName) => {
                        const files = getOnlyValidFile(folderName);
                        const media = mapMedia(files, folderName, fileExtEqual);
                        prev.byId[folderName] = media
                        prev.allIds.push(media.id)
                        return prev;
                    }, {byId : {}, allIds: []});
            } else {
                console.info(`Dir ${baseLocation} does not exist`);
            }
        }
    }
}

export default UtilFactory
