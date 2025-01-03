const dotenv = require("dotenv");

import { logD } from "./common/MessageUtil";
import { USER_LOCATION } from "./common/AppServerConstant";

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
    SERVER_PORT,
    IMG_FOLDER_FALL_BACK,
    VIDEO_PATH,
    SERVER_PROTOCOL,
    MOVIES_DIR,
    SERIES_DIR,
    IMAGES_PORT_SERVER,
    IMAGE_MAP,
  } = process.env;

  const result = {};

  logD("ENV ", process.env.NODE_ENV);

  result.protocol = SERVER_PROTOCOL;
  result.port = SERVER_PORT;
  result.host = getLocalIPAddress();
  // in case you want read the images/posters from the another folder.
  result.imgFolderFallBack = IMG_FOLDER_FALL_BACK;
  result.videosPath = VIDEO_PATH;
  result.moviesDir = MOVIES_DIR;
  result.seriesDir = SERIES_DIR;
  result.baseLocation = USER_LOCATION;
  result.serverUrl = `${result.protocol}://${result.host}:${result.port}`;
  //NGINX and it's not the images url in the AppServerConstant that has /images
  result.imageServerHost = result.host;
  result.imagePort = IMAGES_PORT_SERVER;
  result.imageMapFileName = IMAGE_MAP;

  logD("config result", result);
  return result;
}

function getLocalIPAddress() {
  const os = require("os");

  const networkInterfaces = os.networkInterfaces();
  for (const interfaceName in networkInterfaces) {
    for (const iface of networkInterfaces[interfaceName]) {
      // Look for the IPv4, non-internal address
      if (iface.family === "IPv4" && !iface.internal) {
        console.log("Local Host IP:", iface.address);
        return iface.address;
      }
    }
  }
  return "127.0.0.1"; // Fallback to localhost
}



