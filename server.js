const express = require('express');
const bodyParser = require('body-parser');
const VideosRouter = require('./src/routers/VideosRouter');
const cors = require('cors');

let app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname))

const port = process.env.PORT || 8080;

app.use('/', VideosRouter);

app.listen(port, () => {
    console.log("Application started. Listening on port:" + port)
});

