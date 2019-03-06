const DataAdaptor = require('../../adaptors/DataAccessAdaptor');
const Movie = require('../entities/Movie');

function getAllMovies() {
  return DataAdaptor.readFiles({ type: 'MOVIE' });
}

function getMovie(movieName) {
  const files = DataAdaptor.readFiles({ type: 'MOVIE', folderName: movieName })
  return Movie.makeMedia({ name: movieName, files });
}

function getMovieDetails(folderName) {
  return DataAdaptor.loadMovieDetails(folderName)
}

function getAllCourses() {
  return DataAdaptor.readFiles({ type: 'COURSES' });
}

module.exports = {
  getAllMovies,
  getMovie,
  getMovieDetails,
  getAllCourses,
}

