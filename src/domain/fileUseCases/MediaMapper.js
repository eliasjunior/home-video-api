import {
  VIDEO_FORMATS,
  SUB_FORMATS,
  IMG_FORMATS,
  IMG_FALLBACK,
} from "../../common/AppServerConstant";

export function mapMedia({
  files,
  folderName,
  fileExtEqual,
  isFolder = false,
}) {
  const name = isFolder
    ? folderName
    : files
        .filter((name) => {
          const fileExt = fileExtEqual(name);
          return VIDEO_FORMATS.includes(fileExt);
        })
        .pop();

  const sub = files
    .filter((name) => {
      const fileExt = fileExtEqual(name);
      return SUB_FORMATS.includes(fileExt);
    })
    .pop();

  const img = files
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