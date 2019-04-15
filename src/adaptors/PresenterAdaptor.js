const {
  getAllMovies,
  getMovieByName,
  getMovieDetails,
  getVideoName,
} = require('../movies').mediaUseCase

function loadMovies() {
  const loadFolders = folderName => getMovieByName(folderName)
  return getAllMovies().map(loadFolders);
}

module.exports = {
  loadMovies,
  getMovieByName,
  getMovieDetails,
  getVideoName,
}