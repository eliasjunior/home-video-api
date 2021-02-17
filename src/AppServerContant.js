module.exports = {
  USER_LOCATION: require("os").homedir(),
  MOVIES_LOCATION: "/Downloads",
  COURSE_LOCATION: "/Documents/egghead",
  IMG_FALLBACK: "movie_fallback.png",
  VIDEO_FORMATS: [".mp4", ".m4v", ".mkv"],
  SUB_FORMATS: [".srt", ".vtt"],
  IMG_FORMATS: [".jpg", ".jpeg", "png"],
  DEFAULT_ENCONDING: "utf8",
  VALID_FORMATS: new Map([
    ["mp4", "mp4"],
    ["m4v", "m4v"],
    ["mkv", "mkv"],
  ]),
};
