"use strict";
var http = require('http');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var web = express();
var server = http.createServer(web);

var routes = require('../routes/index');

var port = normalizePort(process.env.PORT || '3000');

// view engine setup
web.set('views', path.join(__dirname, '../views'));
web.set('view engine', 'jade');
web.set('port', port);

// uncomment after placing your favicon in /public
//web.use(favicon(__dirname + '/public/favicon.ico'));
web.use(logger('dev'));
web.use(bodyParser.json());
web.use(bodyParser.urlencoded({extended: false}));
web.use(cookieParser());
web.use('/public', express.static(path.join(__dirname, '../public')));

web.use('/', routes);

// catch 404 and forward to error handler
web.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (web.get('env') === 'development') {
    web.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
web.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});



/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}
server.listen(port);

console.log("Started");

module.exports = server;
