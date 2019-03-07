const router = require('express').Router();
const VideoStreamingService = require('../../services/VideoStreamingService');
const AppServerConstatnt = require('../../AppServerContant');
const Util = require('../../services/FileUtil');
const { requestAdapt } = require('../../httpAdapter');
const {readDirectory } = require('../../handleResquesStream');
const StreamingUtil = require('../../services/StreamingUtil')
const fs = require('fs');
const {
  loadMovies,
  loadMovie,
  getGetFileDetails
} = require('../../adaptors/PresenterAdaptor');


router.get('/movies', (req, response) => {
  flush(response, loadMovies());
})

router.get('/movies/stream/:id', (request, response) => {
  const requestAdapted = requestAdapt(request);
  const { headers, params } = requestAdapted;
  const { id } = params;
  
  const movie = loadMovie(id)
  const fileName = movie.files[0]
  const movieDetails = getGetFileDetails(id, fileName)


  console.log(`fullpath ${movieDetails.location + '/'+ movie.files[0]}`);
  

  try {
    const { range } = headers;
    const statInfo = movieDetails.stats;
    const { size } = statInfo;
    const { start, end } = StreamingUtil.getStartEndBytes(range, size)

    //const videoStream = VideoStreamingService.createStream({ fullPath: movieData, start, end })
    const videoStream = fs
      .createReadStream(movieDetails.location + '/'+ fileName, { start, end });

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