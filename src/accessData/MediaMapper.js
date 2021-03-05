import {
  VIDEO_FORMATS,
  SUB_FORMATS,
  IMG_FORMATS,
  IMG_FALLBACK,
} from "../common/AppServerConstant";

export function mapMedia(fileNameList, folderName, fileExtEqual) {
  const name = fileNameList
    .filter((name) => {
      const fileExt = fileExtEqual(name);
      return VIDEO_FORMATS.includes(fileExt);
    })
    .pop();

  const sub = fileNameList
    .filter((name) => {
      const fileExt = fileExtEqual(name);

      return SUB_FORMATS.includes(fileExt);
    })
    .pop();
 
  const img = fileNameList
    .filter((name) => {
      const fileExt = fileExtEqual(name);
      return IMG_FORMATS.includes(fileExt);
    })
    .pop();

  return {
    name,
    sub,
    id: folderName,
    description: "",
    img: img ? img : IMG_FALLBACK,
  };
}