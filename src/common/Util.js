require("dotenv").config();
const { SERVER_URL, SERVER_URL_PROD, SERVER_PORT, NODE_ENV } = process.env;

export function getPort() {
  return SERVER_PORT;
}

export function getServerUrl() {
  console.log("NODE_ENV", NODE_ENV);
  if (NODE_ENV === "production") {
    return `${SERVER_URL_PROD}:${SERVER_PORT}`;
  } else {
    return `${SERVER_URL}:${SERVER_PORT}`;
  }
}

export function getUserVar() {
  if (NODE_ENV !== "production") {
    return {
      imgBaseLocation: "/Downloads/Images",
      moviesLocation: "/Downloads/Movies",
    };
  } else {
    return {
      imgBaseLocation: "/Images",
      moviesLocation: "/media/pi/ExternalHD/Movies",
    };
  }
}
