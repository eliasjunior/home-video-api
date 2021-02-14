import fs from 'fs';
import Util from '../repository';

const { getStartEndBytes,
    streamListener,
    getHeadStream } = require('./StreamingUtil')

const { VALID_FORMATS }  =  require('../AppServerContant')

function sendStream({ response, range, size, fullPath }) {
    if (range) {
        const { start, end } = getStartEndBytes(range, size)

        const videoStream = fs
            .createReadStream(fullPath, { start, end });
        console.log(`*${fullPath}`);
        
        streamListener(videoStream, response);

        response.writeHead('206', getHeadStream(start, end, size))
    } else {
        fs
            .createReadStream(fullPath)
            .pipe(response);
        response.writeHead(200, getHeadStream(null, null, size))
    }
}
function readOrStream({ request, response, fullPath, baseLocation }) {
    const { fileName } = request.params;
    const { range } = request.headers;

    if (VALID_FORMATS.get(fileName.slice(-3))) {
        try {
            let statInfo = Util.getFileDirInfo(fullPath);
            const { size } = statInfo;

            const options = {
                response,
                range,
                size,
                fullPath
            }
            sendStream(options);
        } catch (error) {
            console.log(error)
            response
                .status(500)
                .send({ 
                    message: 'Something went wrong, file not found, maybe folder has a different name' ,
                    error: error.message})
                .end();
        }
    } else {
        // const options = {
        //     response,
        //     baseLocation,
        //     videosLocation: `/${fileName}`
        // };
        // const videos = Util.getFiles(options)
        // flush(response, videos);
    }
}
module.exports = {
    sendStream,
    readOrStream
}