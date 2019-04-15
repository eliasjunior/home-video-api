const { 
  getStreamHeader, 
  getChunkSize } = require('./MakeVideoPartsAvaialable');

describe('MakeVideoPartsAvaialable', () => {
  it('should get head stream', () => {
    const fileSizeInBytes = 1250
    const startChunk = 1;
    const endChunk = 945;
    const head = {
      startChunk,
      endChunk,
      fileSizeInBytes,
    }
    const expected = {
      'Accept-Ranges' : 'bytes',
      'Content-Length' : getChunkSize(startChunk, endChunk),
      'Content-Range' : `bytes ${startChunk}-${endChunk}/${fileSizeInBytes}`,
      'Content-Type' : 'video/mp4'
    }

    expect(getStreamHeader(head)).toEqual(expected)
  })

  xit('should getStartEndChunkInBytes ', () => {})
})