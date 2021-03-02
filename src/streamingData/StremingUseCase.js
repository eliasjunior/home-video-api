import { logE } from "../common/MessageUtil";

export default function StreamingUseCase({ streamingApi }) {
  const { createReadStream } = streamingApi;
  return {
    createStream: function ({ fileAbsPath, start, end }) {
      try {
        if (start !== undefined) {
          return { streamChunk: createReadStream({ fileAbsPath, start, end }) };
        } else {
          return { streamChunk: createReadStream({ fileAbsPath }) };
        }
      } catch (error) {
        logE(`Attempting to stream file path ${fileAbsPath} has failed`, error);
        throw error;
      }
    },
  };
}
