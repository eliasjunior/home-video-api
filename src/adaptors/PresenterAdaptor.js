const {
  getAllMovies,
  getMovie,
  getMovieDetails,
} = require('../movies').mediaUseCase

function loadMovies() {
  const loadFolders = folderName => getMovie(folderName)
  return getAllMovies().map(loadFolders);
}

function loadMovie(folderName) {
  return getMovie(folderName)
}

function getGetFileDetails(folderName) {
  return getMovieDetails(folderName)
}

module.exports = {
  loadMovies,
  loadMovie,
  getGetFileDetails,
}