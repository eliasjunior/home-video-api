const router = require("express").Router();
const VideoStreamingService = require("../services/VideoStreamingService");
const AppServerConstant = require("../AppServerContant");
import { getUserVar } from "../common/Util";
import UtilFile from "../repository";
const { getFiles, readFile, getFileExt } = UtilFile;
const { imgBaseLocation, moviesLocation } = getUserVar();


let MovieMap = { byId: {}, allIds: [] };
let baseLocationMovie = AppServerConstant.USER_LOCATION + moviesLocation;
let baseLocationCourses =
  AppServerConstant.USER_LOCATION + AppServerConstant.COURSE_LOCATION;

let baseLocationImgs = AppServerConstant.USER_LOCATION + imgBaseLocation;

function redirectMovies(_, res) {
  res.redirect("/movies");
}
function loadMovies(_, response) {
  const videos = getFiles({ baseLocation: baseLocationMovie });

  MovieMap = videos.allIds.reduce(
    (prev, id) => {
      prev.byId[id] = videos.byId[id];
      prev.allIds.push(id);
      return prev;
    },
    { byId: {}, allIds: [] }
  );

  flushJSON(response, videos);
}
function loadMovie(req, response) {
  const { id } = req.params;
  if (MovieMap.allIds.length === 0) {
    //TODO do it later, in case the map empty need to call getFiles
  }
  if (!MovieMap.byId[id]) {
    flushJSON(response, `[${id}] was not found`);
  } else {
    flushJSON(response, MovieMap.byId[id]);
  }
}
function passingBaseLocation(req, response) {
  const { baseLocation } = req.params;
  const temp = "/" + baseLocation.replace(/\./g, "/");
  baseLocationMovie = temp;
  const videos = getFiles({ baseLocation: temp });
  flushJSON(response, videos);
}
function getCourses(_, response) {
  const options = {
    response,
    baseLocation: baseLocationCourses,
    videosLocation: "",
  };
  const videos = getFiles(options);
  flushJSON(response, videos);
}
function StreamingVideo(request, response) {
  const { folder, fileName } = request.params;

  const fullPath = `${baseLocationMovie}/${folder}/${fileName}`;
  const options = {
    request,
    response,
    fullPath,
    baseLocation: baseLocationMovie,
  };
  VideoStreamingService.readOrStream(options);
}
function getCaption(request, response) {
  const { folder, fileName } = request.params;
  const fs = require("fs");
  const fileAbsolutePath = baseLocationMovie + "/" + folder + "/" + fileName;

  const ext = getFileExt(fileName);

  if (ext === ".vtt") {
    response.setHeader("content-type", "vtt");
    fs.createReadStream(fileAbsolutePath).pipe(response);
  } else {
    // TODO have to stream because its crashing
    // const subsrt = require('subsrt');
    // let srtContent = readFile(fileAbsolutePath, '');
    // const srt = subsrt.convert(srtContent, { format: "vtt", fps: 25 });
    // fs.createReadStream(srt).pipe(response);
  }
}
function getImgFromMovie(req, response) {
  const { folder, fileName } = req.params;
  const MINUS_EXT_INDEX = 4;
  const imgFileName = fileName
    .slice(0, fileName.length - MINUS_EXT_INDEX)
    .concat(".jpg");

  const fileAbsolutePath = `${baseLocationImgs}/${folder}/${imgFileName}`;
  //console.log("getting img at", fileAbsolutePath);
  let img = readFile(fileAbsolutePath, "none");
  response.write(img, "binary");
  response.end(null, "binary");
}

router.get("/", redirectMovies);
router.get("/movies", loadMovies);
router.get("/movies/:id", loadMovie);
router.get("/movies/nobase/:baseLocation", passingBaseLocation);
router.get("/courses", getCourses);
router.get("/videos/:folder/:fileName", StreamingVideo);
router.get("/captions/:folder/:fileName", getCaption);
router.get("/images/:folder/:fileName", getImgFromMovie);

function flushJSON(response, videos) {
  response.status(200).json(videos).end();
}

module.exports = router;
