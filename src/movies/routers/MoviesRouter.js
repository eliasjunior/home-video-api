import { flush } from '../../Helper';
import { requestAdapter } from '../../HttpAdapter';
import {
  loadMovies,
  loadMovie,
  getMovieDetails,
} from '../../adaptors/PresenterAdaptor';
import express from 'express';
const router = express.Router();

function getMovies(req, response) {
  flush({response, body: loadMovies(), status: 200});
}

function getMovieImage(req, response) {
  const requestAdapted = requestAdapter(request);
  const { id: folder } = requestAdapted.params;

  const movie = loadMovie(folder);
  const movieImage = getImage(movie);
  const imageDetails = getMovieDetails(folder, movieImage)
  const movieFullPath = `${imageDetails.location}`;
  response.sendFile(movieFullPath);
}

router.get('/movies', getMovies);
router.get('/movies/image/:id', getMovieImage)

export default router;

// Private functions
function getImage({files}) {
  const EXTENSION_SIZE = -3
  const listImages = ['jpg', 'png', 'jpeg'];
  return files
    .filter(file => listImages.some(ext => ext === file.slice(EXTENSION_SIZE)) )
    .pop()
}