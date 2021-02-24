import express from "express";
import { logE } from "../common/MessageUtil";
import UtilFile from "../accessData";
import StreamingData from "../streamingData";
import {
  SUCCESS_STATUS,
  PARTIAL_CONTENT_STATUS,
} from "../common/AppServerContant";
import {
  getHeadStream,
  streamListener,
  getStartEndBytes,
} from "../common/StreamingUtil";
import config from "../config";
const { videosPath, baseLocation } = config();

const { createStream, createStreamNoRange } = StreamingData;
const { getFiles, getFileDirInfo } = UtilFile;
const router = express.Router();

let MovieMap = { byId: {}, allIds: [] };
let baseLocationVideo = baseLocation + videosPath;

function redirectMovies(_, res) {
  res.redirect("/videos");
}
function loadMovies(_, response) {
  const videos = getFiles({ baseLocation: baseLocationVideo });

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
  baseLocationVideo = temp;
  const videos = getFiles({ baseLocation: temp });
  flushJSON(response, videos);
}
function StreamingVideo(request, response) {
  const { folder, fileName } = request.params;
  const { range } = request.headers;
  const fileAbsPath = `${baseLocationVideo}/${folder}/${fileName}`;
  const statInfo = getFileDirInfo(fileAbsPath);
  const { size } = statInfo;
  const { start, end } = getStartEndBytes(range, size);

  try {
    if (range) {
      const { streamChunk } = createStream({
        fileAbsPath,
        start,
        end,
      });
      streamListener(streamChunk, response);
      response.writeHead(
        PARTIAL_CONTENT_STATUS,
        getHeadStream(start, end, size)
      );
    } else {
      createStream(fileAbsPath).pipe(response);
      response.writeHead(SUCCESS_STATUS, getHeadStream(null, null, size));
    }
  } catch (error) {
    logE(`Attempting to stream file path ${fileAbsPath} has failed`, error);
    response
      .status(500)
      .send({
        message:
          "Something went wrong, file not found, maybe folder has a different name",
        error: error.message,
      })
      .end();
  }
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
