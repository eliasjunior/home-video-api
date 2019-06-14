import {
  getAllMovies,
  getMovieByName,
  getMovieDetails,
  getVideoName,
} from '../movies';
import useCaseBox from '../box';

const Presenter = {
  loadMovies: function() {
    const loadFolders = folderName => getMovieByName(folderName)
    return getAllMovies().map(loadFolders);
  },
  getMovieByName,
  getMovieDetails,
  getVideoName,
  listFolders: useCaseBox.loadBox,
}
export default Presenter;

