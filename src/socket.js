"use strict";
var socketio = require('socket.io');
var hostapd = require('./hostapd');
var web = require('./web');
var data = require('./data');
var io = socketio(web);

io.on('connection', (socket) => {
    socket.on('ap-names', (fn) => {
        fn(data.getAPNames());
    });

    socket.on('hostapd-status', (fn) => {
        fn({
            running: hostapd.isRunning(),
            currentBssid: hostapd.getConfig('bssid'),
            currentSsid: hostapd.getConfig('ssid')
        });
    });
    socket.on('ctrl-hostapd-stop', () => {
        hostapd.stop();
    });
    socket.on('ctrl-hostapd-start', () => {
        hostapd.start();
    });
    socket.on('set-temp-mac', (mac) => {
        hostapd.setBssid(mac);
        hostapd.restart();
    });
});

hostapd.on('start', () => {
    io.emit('hostapd-start', {
        running: hostapd.isRunning(),
        currentBssid: hostapd.getConfig('bssid'),
        currentSsid: hostapd.getConfig('ssid')
    });
});
hostapd.on('exit', () => {
    io.emit('hostapd-exit', {
        running: hostapd.isRunning(),
        currentBssid: hostapd.getConfig('bssid'),
        currentSsid: hostapd.getConfig('ssid')
    });
});
hostapd.on('data', (data) => {
    io.emit('hostapd-data', data);
});
hostapd.on('connected', (data) => {
    io.emit('hostapd-connected', data);
});
hostapd.on('disconnected', (data) => {
    io.emit('hostapd-disconnected', data);
});
hostapd.on('update', (configFile) => {
    io.emit('hostapd-update', configFile);
});

exports = module.exports = {
    "cleanup": () => {
        console.log("cleanup");
    }
}
