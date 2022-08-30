require('dotenv').config();

const createError = require('http-errors');
const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const helmet = require('helmet');
const cors = require('cors');
const logger = require('morgan');

const apiRouter = require('./routes/api');

const server = express();

server.use(express.urlencoded({extended: true}));

server.use(express());
server.use(express.json());

server.use(logger('combined'));
server.use(helmet());
server.use(cors());
server.use(cookieParser());
server.use(express.static(path.join(__dirname, 'public')));

server.use('/api', apiRouter);

server.use(function(req, res, next) {
  next(createError(404));
});

// error handler
server.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = server;
