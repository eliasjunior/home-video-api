import { logD, logE } from "../common/MessageUtil";

export default function StreamingUseCase({ streamingApi }) {
  const { createReadStream, createStreamNoRange } = streamingApi;
  return {
    streamData: function ({ fileAbsPath, start, end }) {
      try {
        const stream = createReadStream({ fileAbsPath, start, end });
        logD(stream);
        return stream;
      } catch (error) {
        logE(`Attempting to stream file path ${fileAbsPath} has failed`, error);
        throw error;
      }
    },
    createStreamNoRange: function (fileAbsPath) {
      try {
        createStreamNoRange(fileAbsPath);
      } catch (error) {
        logE(`Attempting to stream file path ${fileAbsPath} has failed`, error);
        throw error;
      }
    },
  };
}
