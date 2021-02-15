const router = require('express').Router();
const VideoStreamingService = require('../services/VideoStreamingService');
const AppServerConstant = require('../AppServerContant');
import Util from '../repository';
import path from 'path';

let MovieMap = {byId : {}, allIds: []};
let baseLocationMovie = AppServerConstant.USER_LOCATION +
    AppServerConstant.MOVIES_LOCATION;
let baseLocationCourses = AppServerConstant.USER_LOCATION +
    AppServerConstant.COURSE_LOCATION;

function redirectMovies(req, res) {
    res.redirect("/movies")
}
function loadMovies(req, response){
    const videos = Util.getFiles({baseLocation: baseLocationMovie});

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
    baseLocationMovie = temp
    const options = {
        response,
        baseLocation: temp,
    };
    const videos = Util.getFiles(options);
    flush(response, videos);
}
function getCourses(req, response) {
    const options = {
        response,
        baseLocation: baseLocationCourses,
        videosLocation: ''
    };
    const videos = Util.getFiles(options)
    flush(response, videos);
}
function StreamingVideo(request, response) {
    const {folder, fileName} = request.params;

    const fullPath = `${baseLocationMovie}/${folder}/${fileName}`;
    const options = {
        request,
        response,
        fullPath,
        baseLocation: baseLocationMovie
    }
    VideoStreamingService.readOrStream(options);
}
function getCaption(request, response){
    const {folder, fileName} = request.params;
    const fileBuffer = Util.readFile(baseLocationMovie + '/' + folder + '/' + fileName)
   // console.log("===================== SendFile", path.join(__dirname + fileBuffer))
    //response.set({"Content-Disposition":"attachment; filename=\"req.params.name\""});
    // response.attachment(fileName)
    // response.type('vtt')
   // response.sendFile(path.join(__dirname + fileBuffer))
   // response.send(fileBuffer)
    const fs = require('fs')
    response.setHeader("content-type", "vtt");
    fs.createReadStream(baseLocationMovie + '/' + folder + '/' + fileName).pipe(response);

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