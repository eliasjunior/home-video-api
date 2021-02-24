import express from "express";
import { IMG_FALLBACK } from "../common/AppServerContant";
import UtilFile from "../accessData";
import { log } from "../common/MessageUtil";
import config from "../config";
const { imgFolderFallBack, baseLocation } = config();
const { readFile } = UtilFile;

let baseLocationImgs = baseLocation + imgFolderFallBack;
const router = express.Router();
const { PWD } = process.env;

function getImgFromMovie(req, response) {
  const { folder, fileName } = req.params;
  const MINUS_EXT_INDEX = 4;
  const imgFileName = fileName
    .slice(0, fileName.length - MINUS_EXT_INDEX)
    .concat(".jpg");

  const absolutPath = `${baseLocationImgs}/${folder}/${imgFileName}`;
  let img = readFile({ absolutPath, encondig: "none", logError: false });
  if (!img) {
    const fallbackFolder = `${PWD}/public/${IMG_FALLBACK}`;
    log(`=== > img[${imgFileName}] not found trying to load fallback img`);
    // fallback img
    img = readFile({ absolutPath: fallbackFolder, encondig: "none" });
  }
  response.write(img, "binary");
  response.end(null, "binary");
}

router.get("/images/:folder/:fileName", getImgFromMovie);

export default router;
