const router = require('express').Router();
const { requestAdapt } = require('../../httpAdapter');
const StreamingUtil = require('../../services/StreamingUtil')
const fs = require('fs');
const {
  getMovieByName,
  getVideoName,
  getMovieDetails,
} = require('../../adaptors/PresenterAdaptor');

router.get('/stream/:id', (request, response) => {
  const requestAdapted = requestAdapt(request);
  const { headers, params } = requestAdapted;
  const { id } = params;
  
  const movie = getMovieByName(id)
  const fileName = getVideoName(movie.files);
  const movieDetails = getMovieDetails(id, fileName)
  
  const movieFullPath = `${movieDetails.location}`;

  try {
    const { range } = headers;
    const statInfo = movieDetails.stats;
    const { size } = statInfo;
    const { start, end } = StreamingUtil.getStartEndChunkInBytes(range, size)

    const videoStream = fs
      .createReadStream(movieFullPath, { start, end });

    videoStream.on('open', () => {
      console.log('Stream Opened!');
    })
    videoStream.on('close', () => {
      console.log('Stream has been Closed');
    })
    videoStream.on('error', error => {
      console.log('ERROR ###################')
      console.log(error)
    })

    videoStream.pipe(response);
    response.writeHead('206', StreamingUtil.getStreamHeader(start, end, size))

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

module.exports = router;