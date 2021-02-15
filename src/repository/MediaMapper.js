import {VIDEO_FORMATS, SUB_FORMATS, IMG_FORMATS, IMG_FALLBACK} from "../AppServerContant";

export function mapMedia(fileNameList, folderName, fileExtEqual) {
    //{name, sub, parentId}
    // need to get file that has video ext and add to the name, get sub and do the same
    const name = fileNameList.filter( name => {
        const fileExt = fileExtEqual(name);
        return VIDEO_FORMATS.includes(fileExt)
    }).pop()

    const sub = fileNameList.filter( name => {
        const fileExt = fileExtEqual(name);
        return SUB_FORMATS.includes(fileExt)
    }).pop()

    const img = fileNameList.filter( name => {
        const fileExt = fileExtEqual(name);
        return IMG_FORMATS.includes(fileExt)
    }).pop()

    return {
        name,
        sub,
        id: folderName,
        description: "",
        img : img ? img : IMG_FALLBACK
    }
}