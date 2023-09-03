import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import VideosRouter from "./src/routers/VideosRouter";
import ImagesRouter from "./src/routers/ImagesRouter";
import CaptionsRouter from "./src/routers/CaptionsRouter";
import { config } from "./src/common/AppServerConstant";
import { logD } from "./src/common/MessageUtil";
import { loadRemoteJsonFile } from "./src/libs/HttpLib";
import path from "path";
import { setMoviesMap } from "./src/libs/MemoryLib";

let app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/public", express.static(path.join(__dirname, "public")));

app.use("/", VideosRouter);
app.use("/", ImagesRouter);
app.use("/", CaptionsRouter);

app.listen(config.port, async () => {
  console.log(`Application started, ${config.serverUrl}`);
  console.log(`App config`);
  console.log(`Movies folder: ${config.moviesDir}`);
  console.log(`baseLocation: ${config.baseLocation}`);

  const jsonUrl = `${config.protocol}://${config.imageServerHost}:${config.imagePort}/json/${config.imageMapFileName}`;
  logD("jsonUrl=>", jsonUrl);
  const moviesMap = await fetchAndLogJsonData(jsonUrl);
  logD("moviesMap=", moviesMap);
  setMoviesMap(moviesMap);
});

async function fetchAndLogJsonData(remoteJsonUrl) {
  try {
    return await loadRemoteJsonFile(remoteJsonUrl);
  } catch (error) {
    console.error(
      `error to retrieve json map in ${remoteJsonUrl} \n ${error.message} \n only production has nginx set up`
    );
  }
}
