import express from "express";
import fs from "fs";
const router = express.Router();
import config from "../config";
const { videosPath } = config();
import UtilFile from "../accessData";
const { getFileExt, readFile } = UtilFile;

function getCaption(request, response) {
  const { folder, fileName } = request.params;

  const fileAbsolutePath = videosPath + "/" + folder + "/" + fileName;

  const ext = getFileExt(fileName);

  if (ext === ".vtt") {
    response.setHeader("content-type", "vtt");
    fs.createReadStream(fileAbsolutePath).pipe(response);
  } else {
    const subsrt = require("subsrt");
    let srtContent = readFile({ absolutPath: fileAbsolutePath });
    const srt = subsrt.convert(srtContent, { format: "vtt", fps: 25 });
    response.send(srt);
  }
}

router.get("/captions/:folder/:fileName", getCaption);

export default router;
