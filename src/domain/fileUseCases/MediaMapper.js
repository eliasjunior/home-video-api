import {
  VIDEO_FORMATS,
  SUB_FORMATS,
  IMG_FORMATS,
  IMAGE_FALLBACK_URL,
  IMAGE_SERVER_URL,
  MOVIE_MAP,
} from "../../common/AppServerConstant";

import { removeSpecialCharacters } from "../../common/Util";

export function mapMedia({
  files,
  folderName,
  fileExtEqual,
  isFolder = false,
}) {
  console.log(IMAGE_FALLBACK_URL);
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

  const img = getImageUrl(folderName, files, fileExtEqual);

  return {
    name,
    sub,
    id: folderName,
    description: "",
    img,
  };
}

// private functions
function getImageUrl(folderName, files, fileExtEqual) {
  const rawFolderName = removeSpecialCharacters(folderName).toLowerCase();
  const obgImg = MOVIE_MAP[rawFolderName];
  if (obgImg) {
    const { folder, imgName } = obgImg;
    return `${IMAGE_SERVER_URL}/${folder}/${imgName};
    }`;
  } else {
    const img = files
      .filter((name) => {
        const fileExt = fileExtEqual(name);
        return IMG_FORMATS.includes(fileExt);
      })
      .pop();
    return img ? img : IMAGE_FALLBACK_URL;
  }
}

