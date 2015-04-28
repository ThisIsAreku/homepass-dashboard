var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('../routes/index');

var web = express();

// view engine setup
web.set('views', path.join(__dirname, '../views'));
web.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//web.use(favicon(__dirname + '/public/favicon.ico'));
web.use(logger('dev'));
web.use(bodyParser.json());
web.use(bodyParser.urlencoded({ extended: false }));
web.use(cookieParser());
web.use(express.static(path.join(__dirname, '../public')));

web.use('/', routes);

// catch 404 and forward to error handler
web.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (web.get('env') === 'development') {
  web.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
web.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = web;
