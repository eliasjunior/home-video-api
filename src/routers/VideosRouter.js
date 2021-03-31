import express from "express";
import { logE } from "../common/MessageUtil";
import DataAccess from "../accessData";
import StreamingData from "../streamingData";
import {
  SUCCESS_STATUS,
  PARTIAL_CONTENT_STATUS,
} from "../common/AppServerConstant";
import {
  getHeaderStream,
  streamEvents,
  getStartEndBytes,
} from "../common/StreamingUtil";
import config from "../config";
import { setMovieMap, getMovieMap, setSeriesMap } from "../common/Util";
import { sendError } from "./RouterUtil";
const { videosPath, moviesDir, seriesDir } = config();

const { createStream } = StreamingData;
const { getVideos, getFileDirInfo, getSeries } = DataAccess;
const router = express.Router();

router.get("/", redirectMovies);
router.get("/videos", loadMovies);
router.get("/series", loadSeries);
router.get("/videos/:id", loadMovie);
router.get("/videos/:folder/:fileName", streamingVideo);

function redirectMovies(_, res) {
  res.redirect("/videos");
}
function loadMovies(_, response) {
  try {
    const videos = getVideos({ baseLocation: `${videosPath}/${moviesDir}` });

    if (videos.allIds.length === 0) {
      sendError({
        response,
        message: `No videos were found in the given location ${videosPath}`,
        statusCode: 500,
      });
    } else {
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
  } catch (error) {
    sendError({
      response,
      message: "Attempt to load videos has failed",
      statusCode: 500,
      error,
    });
  }
}
function loadSeries(_, response) {
  try {
  const folders = getSeries({ baseLocation: `${videosPath}/${seriesDir}` });
  const tempMap = folders.allIds.reduce(
    (prev, id) => {
      prev.byId[id] = folders.byId[id];
      prev.allIds.push(id);
      return prev;
    },
    { byId: {}, allIds: [] }
  );
  setSeriesMap(tempMap);
  flushJSON(response, folders);
} catch (error) {
  sendError({
    response,
    message: "Attempt to load series has failed",
    statusCode: 500,
    error,
  });
}
}
function loadMovie(req, response) {
  const { id } = req.params;
  const MovieMap = getMovieMap();
  if (MovieMap.allIds.length === 0) {
    //TODO do it later, in case the map empty need to call getVideos
  }
  if (!MovieMap.byId[id]) {
    logE(`Attempting to get a video in memory id ${id} has failed`);
    sendError({
      response,
      message:
        "Something went wrong, file in memory resource not fully implemented or id does not exist",
      statusCode: 501,
    });
  } else {
    flushJSON(response, MovieMap.byId[id]);
  }
}
function streamingVideo(request, response) {
  const { folder, fileName } = request.params;
  const { range } = request.headers;
  const fileAbsPath = `${videosPath}/${folder}/${fileName}`;

  try {
    const statInfo = getFileDirInfo(fileAbsPath);
    const { size } = statInfo;
    const { start, end } = getStartEndBytes(range, size);
    if (range) {
      const headers = getHeaderStream({ start, end, size });
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
