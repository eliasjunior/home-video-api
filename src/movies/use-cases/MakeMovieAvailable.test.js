const {
  getAllMovies,
  getMovieByName,
  getVideoName,
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
    expect(getMovieByName('Conan.The.Barberian')).toEqual(expected);
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
      return getMovieByName(movieName)
    })
    expect(moviesFilled[0]).toEqual(expected)
  })

  it('should return the video format from the list', () => {
    const files = ['Ghostbuster.1985.VIP.jpg','Ghostbuster.1985.VIP.mvv', 'Ghostbuster.1985.mp4']
    expect(getVideoName(files)).toBe('Ghostbuster.1985.mp4')

    const anotherFormat = ['Ghostbuster.1985.VIP.jpg','Ghostbuster.1985.VIP.mvv', 'Ghostbuster.1985.mkv']
    expect(getVideoName(anotherFormat)).toBe('Ghostbuster.1985.mkv')
  })

  it('should thrown an exception', () => {
    const withNoMP4 = ['Ghostbuster.1985.VIP.jpg','Ghostbuster.1985.VIP.mvv', 'Ghostbuster.1985.avi']
    expect(() => {
      getVideoName(withNoMP4)
    }).toThrowError()

    expect(() => {
      getVideoName()
    }).toThrowError()
  })
});