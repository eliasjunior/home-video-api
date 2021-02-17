const router = require("express").Router();
const VideoStreamingService = require("../services/VideoStreamingService");
const AppServerConstant = require("../AppServerContant");
import Util from "../repository";

let MovieMap = { byId: {}, allIds: [] };
let baseLocationMovie =
  AppServerConstant.USER_LOCATION + AppServerConstant.MOVIES_LOCATION;
let baseLocationCourses =
  AppServerConstant.USER_LOCATION + AppServerConstant.COURSE_LOCATION;

function redirectMovies(req, res) {
  res.redirect("/movies");
}
function loadMovies(req, response) {
  const videos = Util.getFiles({ baseLocation: baseLocationMovie });

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
  const videos = Util.getFiles({ baseLocation: temp });
  flushJSON(response, videos);
}
function getCourses(req, response) {
  const options = {
    response,
    baseLocation: baseLocationCourses,
    videosLocation: "",
  };
  const videos = Util.getFiles(options);
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

  const ext = Util.GetFileExt(fileName);

  if (ext === ".vtt") {
    response.setHeader("content-type", "vtt");
    fs.createReadStream(fileAbsolutePath).pipe(response);
  } else {
    // TODO have to stream because its crashing
    // const subsrt = require('subsrt');
    // let srtContent = Util.readFile(fileAbsolutePath, '');
    // const srt = subsrt.convert(srtContent, { format: "vtt", fps: 25 });
    // fs.createReadStream(srt).pipe(response);
  }
}

function getFileFromMovie(req, response) {
  const { folder, fileName } = req.params;
  const fileAbsolutePath = baseLocationMovie + "/" + folder + "/" + fileName;
  let img = Util.readFile(fileAbsolutePath, "none");
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
router.get("/images/:folder/:fileName", getFileFromMovie);

function flushJSON(response, videos) {
  response.status(200).json(videos).end();
}

module.exports = router;
