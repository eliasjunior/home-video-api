const router = require('express').Router();
const VideoStreamingService = require('../services/VideoStreamingService');
const AppServerConstant = require('../AppServerContant');
const Util = require('../repository/index');

router.get('/movies', (req, response) => {
    const baseLocation = AppServerConstant.USER_LOCATION +
        AppServerConstant.MOVIES_LOCATION;
    const options = {
        response,
        baseLocation,
    };
    const videos = Util.getFiles(options);
    flush(response, videos);
})
router.get('/movies/:baseLocation', (req, response) => {
    const { baseLocation } = req.params;
    const temp = "/" + baseLocation.replace(/\./g, '/')
    const options = {
        response,
        baseLocation: temp,
    };
    const videos = Util.getFiles(options);
    flush(response, videos);
})
router.get('/courses', (req, response) => {
    const baseLocation = AppServerConstant.USER_LOCATION +
        AppServerConstant.COURSE_LOCATION;
    const options = {
        response,
        baseLocation,
        videosLocation: ''
    };
    const videos = Util.getFiles(options)
    flush(response, videos);
})
router.get('/videos/:folder/:fileName', (request, response) => {
    let baseLocation = AppServerConstant.USER_LOCATION
    const {folder, fileName} = request.params;

    //workaround for now
    const separateIndex = folder.indexOf('_');
    const tempFolder = folder.slice(separateIndex + 1);
    const backWordsIndex = separateIndex - 6;
    const baseFolder = folder.slice(backWordsIndex, separateIndex)

    if (baseFolder === 'movies') {
        baseLocation = baseLocation.concat(AppServerConstant.MOVIES_LOCATION);
    } else {
        baseLocation = baseLocation.concat(AppServerConstant.COURSE_LOCATION);
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
router.get('/captions/:folder/:fileName', (request, response) => {
    let baseLocation = AppServerConstant.USER_LOCATION
    const {folder, fileName} = request.params;
    baseLocation = baseLocation.concat(AppServerConstant.MOVIES_LOCATION);

    response.sendFile(baseLocation + '/' + folder + '/' + fileName)
})

function flush(response, videos) {
    response
        .status(200)
        .json(videos)
        .end();
}

module.exports = router