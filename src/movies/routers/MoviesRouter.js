const router = require('express').Router();

const {
  loadMovies,
  loadMovie,
  getMovieDetails,
} = require('../../adaptors/PresenterAdaptor');

router.get('/movies', (req, response) => {
  flush(response, loadMovies());
})

router.get('/movies/image/:id', (req, response) => {
  const requestAdapted = requestAdapt(request);
  const { id: folder } = requestAdapted.params;

  const movie = loadMovie(folder);
  const movieImage = getImage(movie.files);
  const imageDetails = getMovieDetails(folder, movieImage)
  const movieFullPath = `${imageDetails.location}`;

  console.log(movieFullPath)

  response.sendFile(movieFullPath)
})

function getImage() {
  const listImages = ['jpg', 'png', 'jpeg'];
  return files
    .filter(file => listImages.some(ext => ext === file.slice(-3)) )
    .pop()
}

function flush(response, videos) {
  response
    .status(200)
    .json(videos)
    .end();
}

module.exports = router