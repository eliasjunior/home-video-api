import express from "express";
import fs from "fs";
import { getUserVar } from "../common/Util";
const router = express.Router();
const { moviesLocation, baseLocation } = getUserVar();

function getCaption(request, response) {
  const { folder, fileName } = request.params;
  let baseLocationMovie = baseLocation + moviesLocation;

  const fileAbsolutePath = baseLocationMovie + "/" + folder + "/" + fileName;

  const ext = getFileExt(fileName);

  if (ext === ".vtt") {
    response.setHeader("content-type", "vtt");
    fs.createReadStream(fileAbsolutePath).pipe(response);
  } else {
    // TODO have to stream because its crashing
    // const subsrt = require('subsrt');
    // let srtContent = readFile(fileAbsolutePath, '');
    // const srt = subsrt.convert(srtContent, { format: "vtt", fps: 25 });
    // fs.createReadStream(srt).pipe(response);
  }
}

router.get("/captions/:folder/:fileName", getCaption);

export default router;
