const DataAdaptor = require('../../adaptors/DataAccessAdaptor');
const Movie = require('../entities/Movie');
const { VALID_FORMATS } = require('../../AppServerConstant')

function getAllMovies() {
  return DataAdaptor.readFiles({ type: 'MOVIE' });
}

function getMovieByName(movieName) {
  const files = DataAdaptor.readFiles({ type: 'MOVIE', folderName: movieName })
  return Movie.makeMedia({ name: movieName, files });
}

function getMovieDetails(folderName, fileName) {
  return DataAdaptor.loadMovieDetails(folderName, fileName)
}

function getVideoName(files) {
  const result = files.filter(file => {
    const format = file.slice(-3)
    return VALID_FORMATS.has(format)
  }).pop();

  if (!result) {
    throw Error('File not found in the list')
  }
  return result;
}

function getAllCourses() {
  return DataAdaptor.readFiles({ type: 'COURSES' });
}

module.exports = {
  getAllMovies,
  getMovieByName,
  getMovieDetails,
  getAllCourses,
  getVideoName,
}

