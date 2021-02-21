import { logD, logE } from "../common/MessageUtil";
import { getStartEndBytes } from "../common/StreamingUtil";

export default function StreamingUseCase({ streamingApi, accessDataApi }) {
  const { createReadStream, createStreamNoRange } = streamingApi;
  const { getFileDirInfo } = accessDataApi;
  return {
    streamData: function ({ fileAbsPath, range }) {
      try {
        let statInfo = getFileDirInfo(fileAbsPath);
        const { size } = statInfo;

        const { start, end } = getStartEndBytes(range, size);

        const stream = createReadStream({ fileAbsPath, start, end });

        logD(stream);

        return stream;
      } catch (error) {
        logE(`Attempting to stream file path ${fileAbsPath} has failed`, error);
        throw error;
      }
    },
    createStreamNoRange: function (fileAbsPath, response) {
      try {
        createStreamNoRange(fileAbsPath, response);
      } catch (error) {
        logE(`Attempting to stream file path ${fileAbsPath} has failed`, error);
        throw error;
      }
    },
  };
}
