import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import VideosRouter from "./src/routers/VideosRouter";
import ImagesRouter from "./src/routers/ImagesRouter";
import CaptionsRouter from "./src/routers/CaptionsRouter";
import config from "./src/config";
const { serverUrl, port } = config();

import path from "path";

let app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/public", express.static(path.join(__dirname, "public")));

app.use("/", VideosRouter);
app.use("/", ImagesRouter);
app.use("/", CaptionsRouter);

app.listen(port, () => {
  console.log(`Application started, ${serverUrl}`);
});
