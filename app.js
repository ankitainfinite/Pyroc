var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const config = require("./config.json");
const session = require('express-session');
var http = require('http');
var favicon = require('serve-favicon')

process.env = { ...process.env, ...config };

// Getting Port on which the server has to run
const port = process.env.PORT;

var indexRouter = require('./src/controllers/index');
var directoryRouter = require('./src/controllers/directory.controller');
var fileRouter = require('./src/controllers/file.controller');
var commonRouter = require('./src/controllers/common.controller');

const { getMongoDbInstances } = require('./src/services/db');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(favicon(path.join(__dirname, 'public', "images", 'favicon.png')))

app.use(session({
  secret: 'djhxcvxfgshajfgjhgsjhfgsakjeauytsdfy',
  resave: false,
  saveUninitialized: true
}));

async function start() {
  try {
    const { dbCon, gfs } = await getMongoDbInstances();

    app.use('/', indexRouter);
    app.use('/directory', directoryRouter);
    app.use('/file', fileRouter);
    app.use('/common', commonRouter);

    // catch 404 and forward to error handler
    app.use(function (req, res, next) {
      next(createError(404));
    });

    // error handler
    app.use(function (err, req, res, next) {
      // set locals, only providing error in development
      res.locals.message = err.message;
      res.locals.error = req.app.get('env') === 'development' ? err : {};

      // render the error page
      res.status(err.status || 500);
      res.render('error');
    });

    var server = http.createServer(app);

    server.listen(port);

    server.on('error', (error) => {
      console.log("server error", error);
    });

    server.on('listening', () => {
      console.log("Server running", server.address().port);
    });

  } catch (error) {
    throw error;
  }
}

start();