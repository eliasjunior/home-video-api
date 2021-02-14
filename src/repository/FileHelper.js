import {VIDEO_FORMATS, SUB_FORMATS} from "../AppServerContant";

export function filterValidFiles (fileList, fileExtEqual){
    const isValidExtension = (fileName, fileExtEqual) => {
        return VIDEO_FORMATS.filter(ext =>  ext === fileExtEqual(fileName)).length > 0 ||
        SUB_FORMATS.filter(ext =>  ext === fileExtEqual(fileName)).length > 0
    }
    return fileList.filter(fileName => isValidExtension(fileName, fileExtEqual))
}
export function getFolderName(baseLocation, {readFileOnDisc}) {

    const fileOrFolder = readFileOnDisc(baseLocation);
    return fileOrFolder
        .filter(file => file.isDirectory())
        .map(file => file.name);
}
export function verifyingOrphanFiles(baseLocation, {readFileOnDisc, fileExtEqual}) {
    const justFiles = readFileOnDisc(baseLocation)
        .filter(file => !file.isDirectory())
        .map(file => file.name)

    if(justFiles.length > 0) {
        filterValidFiles(justFiles, fileExtEqual).forEach(name => {
            console.warn(`*** ${name} does not has a parent folder`);
        });
    } else {
        console.info(`No files with video ext[${permittedVideoExtStr()}] or 
            sub ext[${permittedSubExtStr()}] without a parent in ${baseLocation}`)
    }
}
export function getFilesFolder(folderName, readFileOnDisc) {
    try {
        const fileOrFolder = readFileOnDisc(folderName);
        return fileOrFolder
            .map(file => file.name);

    } catch (err) {
        console.error('Unable to scan directory: ' + err);
        return [];
    }
}
function permittedVideoExtStr() {
    return VIDEO_FORMATS.reduce((prev, cur)=> {
        prev = prev.concat(cur) + ", "
        return prev;
    } , "");
}
function permittedSubExtStr() {
    return SUB_FORMATS.reduce((prev, cur)=> {
        prev = prev.concat(cur) + ", "
        return prev;
    } , "");
}
