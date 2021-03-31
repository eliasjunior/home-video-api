let MovieMap = { byId: {}, allIds: [] };
let seriesMap = { byId: {}, allIds: [] };

export function setMovieMap(map) {
  MovieMap = map;
}

export function getMovieMap() {
  return MovieMap;
}

export function setSeriesMap(map) {
  seriesMap = map;
}

export function getSeriesMap() {
  return seriesMap;
}

export function requiredParameter(name, isThrow = true) {
  //TODO add log monitoring
  if (isThrow) {
    throw new Error(`${name} is required`);
  } else {
    console.error(`${name} is required *`);
  }
}

