import { logE } from "../common/MessageUtil";

export default function StreamingUseCase({ streamingApi }) {
  const { createReadStream } = streamingApi;
  return {
    createStream: function ({ fileAbsPath, start, end }) {
      try {
        const streamChunk = createReadStream({ fileAbsPath, start, end });
        return { streamChunk };
      } catch (error) {
        logE(`Attempting to stream file path ${fileAbsPath} has failed`, error);
        throw error;
      }
    },
  };
}
