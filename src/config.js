const dotenv = require("dotenv");

const path = require("path");
import { logD } from "./common/MessageUtil";
import { USER_LOCATION } from "./common/AppServerConstant";
import FileApi from "./libs/FileLib";
const { readJson, readFile } = FileApi();

import { loadRemoteJsonFile } from "./libs/HttpLib";

if (process.env.NODE_ENV === "development") {
  dotenv.config({ path: ".env.development" });
} else if (process.env.NODE_ENV === "production") {
  dotenv.config({ path: ".env.production" });
} else if (process.env.NODE_ENV === "test") {
  dotenv.config({ path: ".env.test" });
} else {
  logD(`there is no set process.env.NODE_ENV=${process.env.NODE_ENV}`);
}

export default function config() {
  const {
    SERVER_HOST,
    SERVER_PORT,
    IMG_FOLDER_FALL_BACK,
    VIDEO_PATH,
    SERVER_PROTOCOL,
    MOVIES_DIR,
    SERIES_DIR,
    IMAGES_HOST_SERVER,
    IMAGES_PORT_SERVER,
    IMAGE_MAP,
  } = process.env;

  const result = {};

  logD("ENV ", process.env.NODE_ENV);

  result.protocol = SERVER_PROTOCOL;
  result.port = SERVER_PORT;
  result.host = SERVER_HOST;
  // in case you want read the images/posters from the another folder.
  result.imgFolderFallBack = IMG_FOLDER_FALL_BACK;
  result.videosPath = VIDEO_PATH;
  result.moviesDir = MOVIES_DIR;
  result.seriesDir = SERIES_DIR;
  result.baseLocation = USER_LOCATION;
  result.serverUrl = `${result.protocol}://${result.host}:${result.port}`;
  result.imageServerUrl = IMAGES_HOST_SERVER;
  result.imagePort = IMAGES_PORT_SERVER;

  if (process.env.NODE_ENV !== "production") {
    const mediaFileInfoPath = path.join(__dirname, "../public", IMAGE_MAP);
    logD("mediaFileInfoPath=", mediaFileInfoPath);
    result.movieMap = readJson(readFile(mediaFileInfoPath));
  } else {
    const jsonUrl = `${result.protocol}://${result.imageServerUrl}:${result.imagePort}/json/${IMAGE_MAP}`;
    result.movieMap = fetchAndLogJsonData(jsonUrl);
  }

  logD("config result", result);
  return result;
}

async function fetchAndLogJsonData(remoteJsonUrl) {
  try {
    const jsonData = await loadRemoteJsonFile(remoteJsonUrl);
    console.log(jsonData);
    logD("jsonData=", jsonData);
    return jsonData;
  } catch (error) {
    console.error(
      `error to retrieve json map in ${remoteJsonUrl} \n ${error.message}`
    );
  }
}
