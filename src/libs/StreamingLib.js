import fs from "fs";

export default function StreamingUseCase() {
  return {
    createReadStream: function ({ fileAbsPath, start, end }) {
      try {
        return fs.createReadStream(fileAbsPath, { start, end });
      } catch (error) {
        throw error;
      }
    },
    createStreamNoRange: function (fileAbsPath) {
      try {
        return fs.createReadStream(fileAbsPath);
      } catch (error) {
        throw error;
      }
    },
  };
}
