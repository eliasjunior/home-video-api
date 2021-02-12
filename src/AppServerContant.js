module.exports = {
    USER_LOCATION: require('os').homedir(),
    MOVIES_LOCATION: '/Downloads',
    COURSE_LOCATION: '/Documents/egghead',
    VIDEO_FORMATS: ['.mp4', '.m4v', '.mkv', '.srt'],
    VALID_FORMATS: new Map([
        ['mp4', 'mp4'], 
        ['m4v', 'm4v'],
        ['mkv', 'mkv']
    ])
}
