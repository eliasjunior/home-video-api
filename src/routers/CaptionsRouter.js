import express from "express";
import { logE } from "../common/MessageUtil";
const router = express.Router();
import config from "../config";
const { videosPath } = config();
import dataAccess from "../accessData";
import StreamingData from "../streamingData";
import { streamListener } from "../common/StreamingUtil";
import subsrt from "subsrt";
import { sendError } from "./RouterUtil";

const { getFileExt, readFile } = dataAccess;
const { createStream } = StreamingData;

function getCaption(request, response) {
  const { folder, fileName } = request.params;

  const fileAbsolutePath = `${videosPath}/${folder}/${fileName}`;
  try {
    const ext = getFileExt(fileName);
    if (ext === ".vtt") {
      response.setHeader("content-type", "vtt");

      const readStream = createStream({ fileAbsPath: fileAbsolutePath });
      streamListener({
        readStream,
        useCaseLabel: "caption",
        outputWriter: response,
      });
    } else {
      let srtContent = readFile({ absolutePath: fileAbsolutePath });
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

router.get("/captions/:folder/:fileName", getCaption);

export default router;
