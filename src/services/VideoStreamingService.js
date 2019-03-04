const fs = require('fs');
const Util = require('../services/FileUtil');

const { getStartEndBytes,
    streamListener,
    getHeadStream } = require('./StreamingUtil')

const { VALID_FORMATS }  =  require('../AppServerContant')


function createStream({fullPath, start, end }) {
    return  fs
    .createReadStream(fullPath, { start, end });
}

function sendStream({ range, size, fullPath }) {
    if (range) {
        const { start, end } = getStartEndBytes(range, size)

        /***
         * 
         *  need to separate stream service from express response
         *  stream service is a detail
         *  response is a detail
         * 
         *  */    
        const videoStream = fs
            .createReadStream(fullPath, { start, end });
        
        //TODO: need to the stream lib out of here, the stream lib is a detail, 
       // streamListener(videoStream, response);
        
      //  response.writeHead('206', getHeadStream(start, end, size))
        return getHeadStream(start, end, size)
    } else {
        fs
            .createReadStream(fullPath)
            .pipe(response);

        response.writeHead(200, getHeadStream(null, null, size))
    }
}
function readOrStream({ request, fullPath, baseLocation }) {
    const { fileName } = request.params;
    const { range } = request.headers;

    if (VALID_FORMATS.get(fileName.slice(-3))) {
        try {
            let statInfo = Util.getFileDirInfo(fullPath);
            const { size } = statInfo;

            const options = {
                range,
                size,
                fullPath
            }
            return sendStream(options);
        } catch (error) {
            // need to throw
            throw Error('Something went wrong, file not found, maybe folder has a different name');
        }
    } else {
        const options = {
            response,
            baseLocation,
            videosLocation: `/${fileName}`
        };
        const videos = Util.getFiles(options)
      //TODO: error here  flush(response, videos);
    }
}
module.exports = {
    sendStream,
    readOrStream,
    createStream,
}