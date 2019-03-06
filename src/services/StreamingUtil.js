function getHeadStream(start, end, size) {
    const chunksize = (end - start) + 1;
    console.log('#chunksize', chunksize)
    if (Number.isInteger(start)) {
        return {
            "Content-Range": `bytes ${start}-${end}/${size}`,
            "Accept-Ranges": "bytes",
            "Content-Length": chunksize,
            "Content-Type": "video/mp4"
        };
    } else {
        return {
            'Content-Length': size,
            'Content-Type': 'video/mp4',
        }
    }
}
function getStartEndBytes(range, size) {
    console.log('range', range, size)
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
    // console.log('start', start)
    // console.log('end', end)
    return { start, end }
}
module.exports = {
    getStartEndBytes,
    getHeadStream,
}