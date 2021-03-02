const { logD } = require("./MessageUtil");
//TODO tidy up here, it should go the use case or add all to the lib + useCase function
function streamListener({ streamChunk, useCaseLabel, outputWriter }) {
  streamChunk.on("open", () => {
    console.log(`Stream ${useCaseLabel} opened`);
    streamChunk.pipe(outputWriter);
  });

  streamChunk.on("close", () => {
    console.log(`Stream ${useCaseLabel} been closed.`);
  });

  streamChunk.on("end", () => {
    console.log(`Stream ${useCaseLabel} ended.`);
  });

  streamChunk.on("error", (error) => {
    console.log(`Stream ${useCaseLabel} ERR! ====`);
    console.error(error);
  });
}
function getHeadStream(start, end, size) {
  const chunksize = end - start + 1;
  console.log("#chunksize", chunksize);
  if (Number.isInteger(start)) {
    return {
      "Content-Range": `bytes ${start}-${end}/${size}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunksize,
      "Content-Type": "video/mp4",
    };
  } else {
    return {
      "Content-Length": size,
      "Content-Type": "video/mp4",
    };
  }
}
function getStartEndBytes(range, size) {
  logD(`range ${range}`);
  const initStr = "bytes=";
  const initStrLength = initStr.length;
  const initialIndex = range.indexOf(initStr) + initStrLength;
  let [start, end] = range.slice(initialIndex).split("-");

  start = start ? Number(start) : 0;
  end = end ? Number(end) : size - 1;

  if (start > end) {
    end = start;
  }
  logD(`start ${start}`);
  logD(`end ${end}`);
  return { start, end };
}
module.exports = {
  getStartEndBytes,
  getHeadStream,
  streamListener,
};
