import fs from "fs";

export default function StreamingUseCase() {
  return {
    createReadStream: function ({ fileAbsPath, start, end }) {
      try {
        if (start) {
          return fs.createReadStream(fileAbsPath, { start, end });
        } else {
          return fs.createReadStream(fileAbsPath);
        }
      } catch (error) {
        throw error;
      }
    }
  };
}
