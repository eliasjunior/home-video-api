import express from "express";
import { IMG_FALLBACK } from "../common/AppServerContant";
import UtilFile from "../accessData";
import { logD } from "../common/MessageUtil";
import config from "../config";
const { imgFolderFallBack, videosPath } = config();
const { readFile } = UtilFile;
import { getMovieMap } from "../common/Util";

const router = express.Router();
const { PWD } = process.env;

function getImgFromMovie(req, response) {
  const { id } = req.params;
  const MINUS_EXT_INDEX = 4;
  const MovieMap = getMovieMap();
 
  const { name, img } = MovieMap.byId[id];
  let imgTemp = img
  let absolutPath = `${videosPath}/${id}/${img}`;
  if (imgFolderFallBack) {//PROD
    imgTemp = name
        .slice(0, name.length - MINUS_EXT_INDEX)
        .concat(".jpg");
    absolutPath = `${imgFolderFallBack}/${id}/${imgTemp}`;
  } 
  logD("====*** absolutPath=" + absolutPath);
  let imgBin = readFile({ absolutPath, encondig: "none", logError: false });
  if (!imgBin) {
    const fallbackFolder = `${PWD}/public/${IMG_FALLBACK}`;
    logD(`=== > img[${imgTemp}] not found trying to load fallback img`);
    // fallback img
    imgBin = readFile({ absolutPath: fallbackFolder, encondig: "none" });
  }
  response.write(imgBin, "binary");
  response.end(null, "binary");
}

router.get("/images/:id", getImgFromMovie);

export default router;
