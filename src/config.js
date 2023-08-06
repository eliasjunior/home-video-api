const dotenv = require("dotenv");

const path = require("path");

import { USER_LOCATION } from "./common/AppServerConstant";
import FileApi from "./libs/FileLib";
const { readJson } = FileApi();

let filePath = path.join(__dirname, "../public", "movie_map_prod.json");

console.log("DEBUG", filePath);

if (process.env.NODE_ENV === "development") {
  dotenv.config({ path: ".env.development" });
  filePath = path.join(__dirname, "../public", "movie_map_dev.json");
} else if (process.env.NODE_ENV === "production") {
  dotenv.config({ path: ".env.production" });
} else {
  console.log(`fail to access process.env.NODE_ENV=${process.env.NODE_ENV}`);
}

export default function config() {
  const {
    SERVER_HOST,
    SERVER_PORT,
    NODE_ENV,
    IMG_FOLDER_FALL_BACK,
    VIDEO_PATH,
    SERVER_PROTOCOL,
    MOVIES_DIR,
    SERIES_DIR,
    IMAGES_HOST_SERVER,
    IMAGES_PORT_SERVER,
  } = process.env;

  const result = {};
  console.log(`NODE_ENV: ${NODE_ENV}`);
  console.log(`VIDEO_PATH: ${VIDEO_PATH}`);
  console.log("IMG", IMAGES_HOST_SERVER);

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
  result.movieMap = readJson(filePath);
  return result;
}
