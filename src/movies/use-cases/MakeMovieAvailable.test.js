const {
  getAllMovies,
  getMovie,
} = require('./MakeMovieAvailable');

jest.mock('../../persistence/FileHelper')

const mockFolders = {
  'Conan.The.Barberian': ['Conan.The.Barberian.mp4', 'Conan.The.Barberian.srt'],
  'The.Matrix': ['The.Matrix.mp4', 'Cover.png'],
}

describe('use case get media', () => {
  beforeEach(() => {
    require('FileHelper').setCurretMockFiles()
  })

  it('should get a list of movies of a given folder', () => {
    const movies = getAllMovies()
    expect(movies).toHaveLength(2);
  });

  it('should get a movie file', () => {
    require('FileHelper').setCurretMockFiles(mockFolders['Conan.The.Barberian']);

    const expected = {
      files: ['Conan.The.Barberian.mp4', 'Conan.The.Barberian.srt'],
      name: 'Conan The Barberian',
      id: 'Conan.The.Barberian',
    }
    expect(getMovie('Conan.The.Barberian')).toEqual(expected);
  });
  it('should get all movies folder and make the content for each', () => {
    const movies = getAllMovies()
    const expected = {
      files: ['Conan.The.Barberian.mp4', 'Conan.The.Barberian.srt'],
      name: 'Conan The Barberian',
      id: 'Conan.The.Barberian',
    }
    const moviesFilled = movies.map(movieName => {
      require('FileHelper').setCurretMockFiles(mockFolders[movieName]);
      return getMovie(movieName)
    })
    expect(moviesFilled[0]).toEqual(expected)
  })
});