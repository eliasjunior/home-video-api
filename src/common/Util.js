let MovieMap = { byId: {}, allIds: [] };

export function setMovieMap(map) {
  MovieMap = map;
}

export function getMovieMap() {
  return MovieMap;
}

export function requiredParameter(name, isThrow = true) {
  //TODO add log monitoring
  if (isThrow) {
    throw new Error(`${name} is required`);
  } else {
    console.error(`${name} is required *`);
  }
}

