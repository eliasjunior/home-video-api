const router = require('express').Router();
const VideoStreamingService = require('../services/VideoStreamingService');
const AppServerConstatnt = require('../AppServerContant');
const Util = require('../services/FileUtil');

router.get('/movies', (req, response) => {
    const baseLocation = AppServerConstatnt.USER_LOCATION +
        AppServerConstatnt.MOVIES_LOCATION;
    const options = {
        response,
        baseLocation,
        videosLocation: ''
    };
    const videos = Util.getFiles(options);
    flush(response, videos);
})
router.get('/courses', (req, response) => {
    const baseLocation = AppServerConstatnt.USER_LOCATION +
        AppServerConstatnt.COURSE_LOCATION;
    const options = {
        response,
        baseLocation,
        videosLocation: ''
    };
    const videos = Util.getFiles(options)
    flush(response, videos);
})
router.get('/videos/:folder/:fileName', (request, response) => {
    let baseLocation = AppServerConstatnt.USER_LOCATION
    const { folder, fileName } = request.params;
    
    //workaround for now
    const separateIndex = folder.indexOf('_');
    const tempFolder = folder.slice(separateIndex + 1);
    const backwordsIndex = separateIndex - 6;
    const baseFolder = folder.slice(backwordsIndex, separateIndex)   
    
    if(baseFolder === 'movies') {
        baseLocation =  baseLocation.concat(AppServerConstatnt.MOVIES_LOCATION);
    } else {
        baseLocation = baseLocation.concat(AppServerConstatnt.COURSE_LOCATION);
    }
    const fullPath = `${baseLocation}/${tempFolder}/${fileName}`;
    const options = {
        request,
        response,
        fullPath,
        baseLocation
    }
    VideoStreamingService.readOrStream(options);
});
function flush(response, videos) {
    response
        .status(200)
        .json(videos)
        .end();
}

module.exports = router