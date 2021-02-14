const router = require('express').Router();
const VideoStreamingService = require('../services/VideoStreamingService');
const AppServerConstant = require('../AppServerContant');
import Util from '../repository';

let MovieMap = {byId : {}, allIds: []};

function redirectMovies(req, res) {
    res.redirect("/movies")
}
function loadMovies(req, response){
    const baseLocation = AppServerConstant.USER_LOCATION +
        AppServerConstant.MOVIES_LOCATION;
    const videos = Util.getFiles({baseLocation});

    MovieMap = videos.allIds.reduce((prev, id) => {
        prev.byId[id] = videos.byId[id]
        prev.allIds.push(id)
        return prev;
    }, {byId : {}, allIds: []});

    flush(response, videos);
}
function loadMovie(req, response) {
    const { id } = req.params;
    if (MovieMap.allIds.length === 0) {
        //TODO do it later, in case the map empry need to call getFiles
    }
    if(!MovieMap.byId[id]) {
        flush(response, `[${id}] was not found`)
    } else {
        flush(response, MovieMap.byId[id]);
    }

}
function passingBaseLocation (req, response) {
    const { baseLocation } = req.params;
    const temp = "/" + baseLocation.replace(/\./g, '/')
    const options = {
        response,
        baseLocation: temp,
    };
    const videos = Util.getFiles(options);
    flush(response, videos);
}
function getCourses(req, response) {
    const baseLocation = AppServerConstant.USER_LOCATION +
        AppServerConstant.COURSE_LOCATION;
    const options = {
        response,
        baseLocation,
        videosLocation: ''
    };
    const videos = Util.getFiles(options)
    flush(response, videos);
}
function StreamingVideo(request, response) {
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
}
function getCaption(request, response){
    let baseLocation = AppServerConstant.USER_LOCATION
    const {folder, fileName} = request.params;
    baseLocation = baseLocation.concat(AppServerConstant.MOVIES_LOCATION);
    response.sendFile(baseLocation + '/' + folder + '/' + fileName)
}

router.get("/", redirectMovies)
router.get('/movies', loadMovies)
router.get('/movies/:id', loadMovie)
router.get('/movies/nobase/:baseLocation', passingBaseLocation)
router.get('/courses', getCourses)
router.get('/videos/:folder/:fileName', StreamingVideo)
router.get('/captions/:folder/:fileName', getCaption)

function flush(response, videos) {
    response
        .status(200)
        .json(videos)
        .end();
}

module.exports = router