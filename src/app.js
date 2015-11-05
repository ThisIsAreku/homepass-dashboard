"use strict";
exports = module.exports = {
    "getServer": function () {
        return server;
    },
    "getSocket": function () {
        return socket;
    },
    "getWeb": function () {
        return web;
    }
};

var debug = require('debug')('paspi-pass:server');
var hostapd = require('./hostapd');
var web = require('./web');
var socket = require('./socket');


hostapd.setBssid('BA:6A:CE:E7:4E:F1');
hostapd.setSsid('attwifi');
/**
 * Listen on provided port, on all network interfaces.
 */

web.on('error', () => {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
});
web.on('listening', () => {
    var addr = web.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    debug('Listening on ' + bind);
});

/**
 * Cleanup on quit
 */

function exitHandler(options, err) {
    hostapd.cleanup();
    // socket.cleanup();
    if (err) console.log(err.stack);
    if (options.exit) process.exit();
}

//do something when app is closing
process.on('exit', exitHandler.bind(null, {}));

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, {exit: true}));