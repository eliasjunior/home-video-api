import express from "express";
import { getMovieMap } from "../common/Util";
import { imgProvider } from "./RouterUtil";

const router = express.Router();


function getImgFromMovie(req, response) {
  const { id } = req.params;

  const MovieMap = getMovieMap();
  const { name, img } = MovieMap.byId[id];

  let binImg = imgProvider({ id, name, img });

  response.write(binImg, "binary");
  response.end(null, "binary");
}

router.get("/images/:id", getImgFromMovie);

export default router;
