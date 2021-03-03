require("dotenv").config();
const {
  SERVER_HOST,
  NODE_ENV,
  IMG_FOLDER_FALL_BACK,
  VIDEO_PATH,
  SERVER_PROTOCOL,
  SERVER_PORT,
} = process.env;
import { USER_LOCATION } from "./common/AppServerContant";

export default function config() {
  const result = {};
  if (NODE_ENV === "production") {
    result.protocol = SERVER_PROTOCOL;
    result.port = process.env.PORT || SERVER_PORT;
    result.host = SERVER_HOST;
    result.imgFolderFallBack = "/home/pi" + IMG_FOLDER_FALL_BACK;
    result.videosPath = VIDEO_PATH;
  } else {
    result.protocol = "http";
    result.port = 8080;
    result.host = "localhost";
    result.videosPath = `${USER_LOCATION}/Downloads/Movies`;
  }
  result.baseLocation = USER_LOCATION;
  result.serverUrl = `${result.protocol}://${result.host}:${result.port}`;
  return result;
}

// function getUserLocProd() {
//   return USER_LOCATION === "/root" ? "/home/pi" : USER_LOCATION;
// }
