export const USER_LOCATION = require("os").homedir();
import config from "../config";
const { imageServerUrl, imagePort, movieMap } = config();
export const IMG_FALLBACK = "movie_fallback.png";
export const VIDEO_FORMATS = [".mp4", ".m4v", ".mkv", ".avi"];
export const SUB_FORMATS = [".srt", ".vtt"];
export const IMG_FORMATS = [".jpg", ".jpeg", ".png"];
export const DEFAULT_ENCODING = "utf8";
export const PARTIAL_CONTENT_STATUS = 206;
export const SUCCESS_STATUS = 200;
export const INTERNAL_SERVER_ERROR = 500;
export const BASE_STREAM_CALC = 10;
export const EXPONENT = 7;
export const IMAGE_RESOURCE = `images`;
export const IMAGE_FALLBACK_URL = `http://${imageServerUrl}:${imagePort}/${IMAGE_RESOURCE}/${IMG_FALLBACK}`;
export const IMAGE_SERVER_URL = `http://${imageServerUrl}:${imagePort}/${IMAGE_RESOURCE}`;
export const MOVIE_MAP = movieMap; 

