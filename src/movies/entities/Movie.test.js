const makeMedia = require('./Movie').makeMedia;

describe('Entity Media', () => {
  it('should pass the name of the media and return all it values', () => {
    const dataMediaMock = {
      name: 'Conan.Barberian',
      data: '/somefolder/Conan.Barberian',
      files: [
        'Conan.barberian.mp4',
        'Conan Cover.jpg',
        'Conan.barberian.srt'
      ]
    }
    const expected = {
      name: 'Conan Barberian',
      id: 'Conan.Barberian',
      data: '/somefolder/Conan.Barberian',
      files: [
        'Conan.barberian.mp4',
        'Conan Cover.jpg',
        'Conan.barberian.srt'
      ]
    }
    expect(makeMedia(dataMediaMock)).toEqual(expected);
  });
  it('should complain that the media name is empty', () => {
    expect(() => {
      makeMedia();
    }).toThrowError();
  });
  
  it('should remove special character from movie name', () => {
    const dataMedia = {
      name: 'Conan.Barberian-MTV(1965)',
    }
    expect(makeMedia(dataMedia).name).toEqual('Conan Barberian MTV 1965');
  })
});