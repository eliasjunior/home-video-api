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

function getGetFileDetails(folderName, fileName) {
  return getMovieDetails(folderName, fileName)
}

module.exports = {
  loadMovies,
  loadMovie,
  getGetFileDetails,
}