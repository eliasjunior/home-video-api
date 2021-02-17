const express = require('express');
const bodyParser = require("body-parser");
const cors = require('cors');
import VideosRouter from "./src/routers/VideosRouter";
import path from "path";

let app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/static", express.static(path.join(__dirname, "public")));

const port = process.env.PORT || 8080;

app.use('/', VideosRouter);

app.listen(port, () => {
    console.log("Application started. Listening on port:" + port)
});

