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

        return { stream, start, end };
      } catch (error) {
        logE(`Attempting to stream file path ${fileAbsPath} has failed`, error);
        throw error;
      }
    },
    createStreamNoRange: function (fileAbsPath) {
      try {
        return createStreamNoRange(fileAbsPath);
      } catch (error) {
        logE(`Attempting to stream file path ${fileAbsPath} has failed`, error);
        throw error;
      }
    },
  };
}
