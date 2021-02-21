
import { logE } from "../common/MessageUtil";
import Util from "../accessData";
import {
  getStartEndBytes,
  streamListener,
  getHeadStream,
} from "./StreamingUtil";
import { SUCCESS_STATUS, PARTIAL_CONTENT_STATUS } from "../AppServerContant";
import StreamingData from "../streamingData";
const { streamData } = StreamingData;

export function readOrStream({ range, response, fileAbsPath }) {
  try {
    let statInfo = Util.getFileDirInfo(fileAbsPath);
    const { size } = statInfo;

    if (range) {
      const { start, end } = getStartEndBytes(range, size);

      const videoStream = streamData({ fileAbsPath, start, end });

      streamListener(videoStream, response);

      response.writeHead(
        PARTIAL_CONTENT_STATUS,
        getHeadStream(start, end, size)
      );
    } else {
      createStreamNoRange(fileAbsPath);
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
