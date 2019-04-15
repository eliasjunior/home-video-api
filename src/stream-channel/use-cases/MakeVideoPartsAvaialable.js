function getStreamHeader({ startChunk, endChunk, fileSizeInBytes }) {
  const chunksize = getChunkSize(startChunk, endChunk);
  if (Number.isInteger(startChunk)) {
    return {
      "Content-Range": `bytes ${startChunk}-${endChunk}/${fileSizeInBytes}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunksize,
      "Content-Type": "video/mp4"
    };
  } else {
    return {
      'Content-Length': fileSizeInBytes,
      'Content-Type': 'video/mp4',
    }
  }
}
//TODO: need to add test here, edge cases, size, range
function getStartEndChunkInBytes(range, size) {
  const initStr = 'bytes=';
  const initStrLength = initStr.length;
  const initialIndex = range.indexOf(initStr) + initStrLength
  let [start, end] = range
    .slice(initialIndex)
    .split('-')

  start = start ? Number(start) : 0;
  end = end ? Number(end) : size - 1;

  if (start > end) {
    end = start;
  }
  return { start, end }
}

function getChunkSize(startChunk, endChunk) {
  return (endChunk - startChunk) + 1
}
module.exports = {
  getStartEndChunkInBytes,
  getStreamHeader,
  getChunkSize
}