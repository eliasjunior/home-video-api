const { MOVIES_LOCATION,
  USER_LOCATION } = require('../AppServerContant')
const dataSource = require('../persistence/FileHelper')

function readFiles({type, folderName = ''}) {
    switch(type) {
      case 'MOVIE': 
        const videosLocation = `/${USER_LOCATION}/${MOVIES_LOCATION}/${folderName}`
        const files = dataSource.readSyncFile(videosLocation);
        return files.filter(removeHiddenFiles)
      default : 
        return []  
    }
}
/**
 * @param {string} folderName 
 */
function loadMovieDetails(folderName) {
  const videosLocation = `/${USER_LOCATION}/${MOVIES_LOCATION}/${folderName}`
  return dataSource.getFileInfo(videosLocation);
}

module.exports = {
  readFiles,
  loadMovieDetails,
}

function removeHiddenFiles(file){
  const FIRST_CHAR = 0;
  return file.indexOf('.') !== FIRST_CHAR
}