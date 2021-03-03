import express from "express";
import { logE } from "../common/MessageUtil";
import DataAccess from "../accessData";
import StreamingData from "../streamingData";
import {
  SUCCESS_STATUS,
  PARTIAL_CONTENT_STATUS,
} from "../common/AppServerContant";
import {
  getHeaderStream,
  streamEvents,
  getStartEndBytes,
} from "../common/StreamingUtil";
import config from "../config";
const { videosPath } = config();
import { setMovieMap, getMovieMap } from "../common/Util";
import { sendError } from "./RouterUtil";

const { createStream } = StreamingData;
const { getFiles, getFileDirInfo } = DataAccess;
const router = express.Router();

router.get("/", redirectMovies);
router.get("/videos", loadMovies);
router.get("/videos/:id", loadMovie);
router.get("/videos/nobase/:baseLocation", passingBaseLocation);
router.get("/videos/:folder/:fileName", StreamingVideo);

function redirectMovies(_, res) {
  res.redirect("/videos");
}
function loadMovies(_, response) {
  const videos = getFiles({ baseLocation: videosPath });

  const tempMap = videos.allIds.reduce(
    (prev, id) => {
      prev.byId[id] = videos.byId[id];
      prev.allIds.push(id);
      return prev;
    },
    { byId: {}, allIds: [] }
  );
  setMovieMap(tempMap);

  flushJSON(response, videos);
}
function loadMovie(req, response) {
  const { id } = req.params;
  const MovieMap = getMovieMap();
  if (MovieMap.allIds.length === 0) {
    //TODO do it later, in case the map empty need to call getFiles
  }
  if (!MovieMap.byId[id]) {
    logE(`Attempting to get a video in memory id ${id} has failed`);
    sendError({
      response,
      message: "Something went wrong, file in memory resource not fully implemented or id does not exist",
      statusCode: 501,
    });
  } else {
    flushJSON(response, MovieMap.byId[id]);
  }
}
function passingBaseLocation(req, response) {
  const { baseLocation } = req.params;
  const temp = "/" + baseLocation.replace(/\./g, "/");
  const videos = getFiles({ baseLocation: temp });
  flushJSON(response, videos);
}
function StreamingVideo(request, response) {
  const { folder, fileName } = request.params;
  const { range } = request.headers;
  const fileAbsPath = `${videosPath}/${folder}/${fileName}`;

  try {
    const statInfo = getFileDirInfo(fileAbsPath);
    const { size } = statInfo;
    const { start, end } = getStartEndBytes(range, size);
    if (range) {
      const headers = getHeaderStream({  start, end, size  });
      //write the header on response and pass it to stream
      response.writeHead(PARTIAL_CONTENT_STATUS, headers);

      const readStream = createStream({
        fileAbsPath,
        start,
        end,
      });

      // Stream the video chunk to the client
      streamEvents({
        readStream,
        useCaseLabel: "video",
        outputWriter: response,
      });
    } else {
      logE(`NO RANGE ${fileAbsPath}`);
      sendError({
        response,
        message: "There is no range",
        statusCode: 500,
      });
    }
  } catch (error) {
    logE(`Attempting to stream file path ${fileAbsPath} has failed`, error);
    sendError({
      response,
      message:
        "Something went wrong, file not found, maybe folder has a different name",
      statusCode: 500,
      error,
    });
  }
}

// private functions

function flushJSON(response, videos) {
  response.status(SUCCESS_STATUS).json(videos).end();
}

export default router;
