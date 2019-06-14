import express from 'express';
import bodyParser from 'body-parser';
import VideosRouter from './movies/routers/MoviesRouter';
import BoxRouter from './box/routers/BoxRouter';
//const StreamRouter = require('./src/stream-channel/router/StreamRouter');

let app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname))

const port = process.env.PORT || 8080;

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
app.use('/', BoxRouter);
//app.use('/', StreamRouter);

app.listen(port, () => {
  console.log("Application started. Listening on port:" + port)
});
