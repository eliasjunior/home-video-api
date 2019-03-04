const router = require('express').Router();
const VideoStreamingService = require('../../services/VideoStreamingService');
const AppServerConstatnt = require('../../AppServerContant');
const Util = require('../../services/FileUtil');
const { requestAdapt } = require('../../httpAdapter');
const { readDirectory } = require('../../handleResquesStream');
const StreamingUtil = require('../../services/StreamingUtil')
const fs = require('fs');
const { loadMovies,
  loadMovie,
  getGetFileDetails
} = require('../../adaptors/PresenterAdaptor');

//TODO: index here
const {
  getHeadStream
} = require('../../stream-channel/use-cases/MakeVideoPartsAvaialable')

router.get('/movies', (req, response) => {
  flush(response, loadMovies());
})

router.get('/movies/stream/:id', (req, response) => {
  const requestAdapted = requestAdapt(request)
  const { headers, params } = requestAdapted;
  const { id } = params;

  const { data: movieData } = loadMovie(id)
  console.log('FULL PATH', movieData)

  try {
    const { range } = headers;
    const statInfo = getGetFileDetails(id); //TODO: returning null
    const { size } = statInfo;
    const { start, end } = StreamingUtil.getStartEndBytes(range, size)
   
    //const videoStream = VideoStreamingService.createStream({ fullPath: movieData, start, end })
    const videoStream = fs
    .createReadStream(fullPath, { start, end });

    // adapt the response ? 
    //********************** StreamingUtil.streamListener ********************** */
    videoStream.on('open', () => {
      console.log('Stream Opened!');
      videoStream.pipe(response);
    })

    videoStream.on('close', () => {
      console.log('Stream has been Closed');
    })

    videoStream.on('error', error => {
      console.log('ERROR ###################')
      console.log(error)
    })
    //********************** END StreamingUtil.streamListener ********************** */

    response.writeHead('206', getHeadStream(start, end, size))

  } catch (error) {
    console.error(error)
    response
      .status(500)
      .send({
        message: 'Something went wrong, file not found, maybe folder has a different name',
        error: error.message
      })
      .end();
  }
});

router.get('/videos/:folder/:fileName', (request, response) => {
  let baseLocation = AppServerConstatnt.USER_LOCATION
  const { folder, fileName } = request.params;

  //workaround for now
  const separateIndex = folder.indexOf('_');
  const tempFolder = folder.slice(separateIndex + 1);
  const backwordsIndex = separateIndex - 6;
  const baseFolder = folder.slice(backwordsIndex, separateIndex)

  if (baseFolder === 'movies') {
    baseLocation = baseLocation.concat(AppServerConstatnt.MOVIES_LOCATION);
  }
  const fullPath = `${baseLocation}/${tempFolder}/${fileName}`;

  const requestAdapted = requestAdapt(request);
  try {
    // TODO: get only range
    const { range } = requestAdapted.headers;
    let statInfo = Util.getFileDirInfo(fullPath);
    const { size } = statInfo;
    const { start, end } = StreamingUtil.getStartEndBytes(range, size)
    const videoStream = VideoStreamingService.createStream({ fullPath, start, end })

    // adapt the response ? 
    StreamingUtil.streamListener(videoStream, response);

    // const headStream = VideoStreamingService.readOrStream(options);

    response.writeHead('206', StreamingUtil.getHeadStream(start, end, size))
  } catch (error) {
    console.error(error)
    response
      .status(500)
      .send({
        message: 'Something went wrong, file not found, maybe folder has a different name',
        error: error.message
      })
      .end();
  }
});

function flush(response, videos) {
  response
    .status(200)
    .json(videos)
    .end();
}

module.exports = router