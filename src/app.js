"use strict";
const hostapd = require('./hostapd');
const scheduler = require('./scheduler');
const web = require('./web');
const socket = require('./socket');


/**
 * Cleanup on quit
 */
function exitHandler(options, err) {
    hostapd.cleanup();
    // socket.cleanup();
    if (err) console.log(err.stack);
    if (options.exit) process.exit();
}

process.on('exit', exitHandler.bind(null, {}));
process.on('SIGINT', exitHandler.bind(null, {exit: true}));


