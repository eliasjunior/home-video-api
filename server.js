const express = require('express');
const bodyParser = require('body-parser');
const VideosRouter = require('./src/movies/routers/MoviesRouter');
const cors = require('cors');

let app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname))

const port = process.env.PORT || 8080;
// DELETE CORS
app.use(cors())
app.options('*', cors()) 
// ***
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

    if ('OPTIONS' === req.method) {
        res.sendStatus(200);
    }
    else {
        next();
    }
});
app.use('/', VideosRouter);

app.listen(port, () => {
    console.log("Application started. Listening on port:" + port)
});
