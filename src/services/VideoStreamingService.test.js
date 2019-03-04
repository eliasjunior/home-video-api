const { getStartEndBytes } = require('./StreamingUtil');

describe('VideoStreamingService', () => {
    it('should get start, end position from head range', () => {
        let range = 'bytes=0-'
        let size = 200;
        expect(getStartEndBytes(range, size)).toEqual({end:199, start: 0})

        range = 'bytes=-'
        size = 200;
        expect(getStartEndBytes(range, size)).toEqual({end:199, start: 0})

        range = 'bytes'
        size = 200;
        expect(getStartEndBytes(range, size)).toEqual({end:199, start: 0})

        range = ''
        size = 200;
        expect(getStartEndBytes(range, size)).toEqual({end:199, start: 0})

        range = 'bytes=22-80'
        size = 200;
        expect(getStartEndBytes(range, size)).toEqual({end:80, start: 22})
    });
    it('should get start, end position from head range', () => {
        let range = 'bytes=1505329152-'
        let size = 200;
        expect(getStartEndBytes(range, size)).toEqual({end:1505329152, start: 1505329152})
    })
});