const express = require('express');
const bodyParser = require("body-parser");
const cors = require('cors');
import VideosRouter from "./src/routers/VideosRouter";
import path from "path";
import { getServerUrl, getPort } from "./src/common/Util";

let app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/static", express.static(path.join(__dirname, "public")));

app.use('/', VideosRouter);

app.listen(getPort(), () => {
  console.log(`Application started, ${getServerUrl()}`);
});

