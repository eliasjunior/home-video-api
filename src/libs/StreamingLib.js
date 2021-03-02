import fs from "fs";

export default function StreamingUseCase() {
  return {
    createReadStream: function ({ fileAbsPath, start, end }) {
      if (start !== undefined) {
        return fs.createReadStream(fileAbsPath, { start, end });
      } else {
        return fs.createReadStream(fileAbsPath);
      }
    },
  };
}
