import {
  MOVIES_LOCATION,
  USER_LOCATION
} from '../AppServerConstant';
import { readSyncFile, fileInfo } from '../persistence/FileHelper';

export function getFolderByName({
  rootDirectory = USER_LOCATION,
  folderName = '',
  currentFolder = MOVIES_LOCATION,
}) {
  const fileLocation = `/${rootDirectory}/${currentFolder}/${folderName}`;
  const files = readSyncFile(fileLocation)
    .map(file => {
      return {
        isFolder: fileInfo(`${fileLocation}${file}`).isDirectory(),
        name: file,
        path: `${fileLocation}${file}`,
      }
    });

  return files;
}

export function readFiles({ type, folderName = '' }) {
  switch (type) {
    case 'MOVIE':
      const videosLocation = `/${USER_LOCATION}/${MOVIES_LOCATION}/${folderName}`
      const files = dataSource.readSyncFile(videosLocation);
      return files.filter(removeHiddenFiles)
    default:
      return []
  }
}

export function loadMovieDetails(folderName, fileName) {
  const videosLocation = `/${USER_LOCATION}/${MOVIES_LOCATION}/${folderName}/${fileName}`
  return {
    stats: dataSource.getFileInfo(videosLocation),
    location: videosLocation
  };
}

function removeHiddenFiles(file) {
  const FIRST_CHAR = 0;
  return file.indexOf('.') !== FIRST_CHAR
}