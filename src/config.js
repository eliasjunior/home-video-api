require("dotenv").config();
const {
  SERVER_HOST,
  NODE_ENV,
  IMG_FOLDER_FALL_BACK,
  VIDEO_PATH,
  SERVER_PROTOCOL,
  SERVER_PORT,
  VIDEO_PATH_LOCAL,
  MOVIES_DIR,
  SERIES_DIR,
} = process.env;
import { USER_LOCATION } from "./common/AppServerConstant";

export default function config() {
  const result = {};
  if (NODE_ENV === "production") {
    result.protocol = SERVER_PROTOCOL;
    result.port = process.env.PORT || SERVER_PORT;
    result.host = SERVER_HOST;
    // in case you want read the images/posters from the another folder.
    result.imgFolderFallBack = IMG_FOLDER_FALL_BACK;
    result.videosPath = VIDEO_PATH;
  } else {
    // local environment, just for development
    result.protocol = "http";
    result.port = 8080;
    result.host = "localhost";
    result.videosPath = `${USER_LOCATION}/${VIDEO_PATH_LOCAL}`;
  }
  result.moviesDir = MOVIES_DIR;
  result.seriesDir = SERIES_DIR;
  result.baseLocation = USER_LOCATION;
  result.serverUrl = `${result.protocol}://${result.host}:${result.port}`;
  return result;
}
