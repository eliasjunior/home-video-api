import {
  getAllMovies,
  getMovieByName,
  getMovieDetails,
  getVideoName,
} from '../movies';

function loadMovies() {
  const loadFolders = folderName => getMovieByName(folderName)
  return getAllMovies().map(loadFolders);
}
const Presenter = {
  loadMovies,
  getMovieByName,
  getMovieDetails,
  getVideoName,
}
export default Presenter;

