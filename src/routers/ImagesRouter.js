import express from "express";
import { IMG_FALLBACK } from "../AppServerContant";
import UtilFile from "../accessData";
import { getUserVar } from "../common/Util";
const { readFile } = UtilFile;
const { imgBaseLocation, baseLocation } = getUserVar();

let baseLocationImgs = baseLocation + imgBaseLocation;
const router = express.Router();
const { PWD } = process.env;

function getImgFromMovie(req, response) {
  const { folder, fileName } = req.params;
  const MINUS_EXT_INDEX = 4;
  const imgFileName = fileName
    .slice(0, fileName.length - MINUS_EXT_INDEX)
    .concat(".jpg");

  const fileAbsolutePath = `${baseLocationImgs}/${folder}/${imgFileName}`;
  let img = readFile(fileAbsolutePath, "none");
  if (!img) {
    // fallback img
    img = readFile(`${PWD}/public/${IMG_FALLBACK}`, "none");
  }
  response.write(img, "binary");
  response.end(null, "binary");
}

router.get("/images/:folder/:fileName", getImgFromMovie);

export default router;
