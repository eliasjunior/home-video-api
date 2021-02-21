import express from "express";
import VideoStreamingService from "../services/VideoStreamingService";
import { getUserVar } from "../common/Util";
import UtilFile from "../accessData";
const { getFiles } = UtilFile;
const { moviesLocation, baseLocation } = getUserVar();
const router = express.Router();

let MovieMap = { byId: {}, allIds: [] };
let baseLocationMovie = baseLocation + moviesLocation;

function redirectMovies(_, res) {
  res.redirect("/videos");
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
function StreamingVideo(request, response) {
  const { folder, fileName, range } = request.params;

  const fileAbsPath = `${baseLocationMovie}/${folder}/${fileName}`;
  VideoStreamingService.readOrStream({ range, response, fileAbsPath });
}

router.get("/", redirectMovies);
router.get("/videos", loadMovies);
router.get("/videos/:id", loadMovie);
router.get("/videos/nobase/:baseLocation", passingBaseLocation);
router.get("/videos/:folder/:fileName", StreamingVideo);

function flushJSON(response, videos) {
  response.status(200).json(videos).end();
}

export default router;
