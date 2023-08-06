import {
  VIDEO_FORMATS,
  SUB_FORMATS,
  IMAGE_FALLBACK_URL,
  IMG_FORMATS,
  IMAGE_SERVER_URL,
  MOVIE_MAP,
} from "../../common/AppServerConstant";

import { logD } from "../../common/MessageUtil";
import { getImageUrl } from "../../common/Util";

export function mapMedia({
  files,
  folderName,
  fileExtEqual,
  isFolder = false,
}) {
  logD(IMAGE_FALLBACK_URL);
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

  const img = getImageUrlHelper(folderName, files, fileExtEqual);
  return {
    name,
    sub,
    id: folderName,
    description: "",
    img,
  };
}

export function getImageUrlHelper(folderName, files, fileExtEqual) {
  const url = getImageUrl(folderName, MOVIE_MAP, IMAGE_SERVER_URL);
  if (url != "") {
    return url;
  }
  const img = files
    .filter((name) => {
      const fileExt = fileExtEqual(name);
      return IMG_FORMATS.includes(fileExt);
    })
    .pop();
  return img ? img : IMAGE_FALLBACK_URL;
}


