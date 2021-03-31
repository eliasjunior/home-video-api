import express from "express";
import { logE } from "../common/MessageUtil";
const router = express.Router();
import config from "../config";
import dataAccess from "../accessData";
import StreamingData from "../streamingData";
import { streamEvents } from "../common/StreamingUtil";
import subsrt from "subsrt";
import { sendError } from "./RouterUtil";

const { videosPath, moviesDir, seriesDir } = config();
const moviesAbsPath = `${videosPath}/${moviesDir}`;
const seriesAbsPath = `${videosPath}/${seriesDir}`;

const { getFileExt, readFile } = dataAccess;
const { createStream } = StreamingData;

router.get("/captions/:folder/:fileName", getCaption);
router.get("/captions/:parent/:folder/:fileName", getCaptionShow);

function getCaption(request, response) {
  const { folder, fileName } = request.params;
  const fileAbsPath = `${moviesAbsPath}/${folder}/${fileName}`;
  doCaption({ request, response, fileAbsPath });
}

function getCaptionShow(request, response) {
  const { folder, fileName, parent } = request.params;
  const fileAbsPath = `${seriesAbsPath}/${parent}/${folder}/${fileName}`;
  doCaption({ request, response, fileAbsPath });
}

function doCaption({ request, response, fileAbsPath }) {
  const { fileName } = request.params;
  try {
    const ext = getFileExt(fileName);
    if (ext === ".vtt") {
      response.setHeader("content-type", "vtt");

      const readStream = createStream({ fileAbsPath });
      streamEvents({
        readStream,
        useCaseLabel: "caption",
        outputWriter: response,
      });
    } else {
      let srtContent = readFile({ absolutePath: fileAbsPath });
      const srt = subsrt.convert(srtContent, { format: "vtt", fps: 25 });
      response.send(srt);
    }
  } catch (error) {
    logE(
      `Attempting to play subtitles file path ${fileName} has failed`,
      error
    );
    sendError({
      response,
      message: "Something went wrong, file not found",
      statusCode: 500,
      error,
    });
  }
}



export default router;
