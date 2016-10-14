"use strict";
const socketio  = require('socket.io');
const hostapd   = require('./hostapd');
const web       = require('./web');
const data      = require('./data');
const scheduler = require('./scheduler');
const io        = socketio(web);

function compileInfo() {
    return {
        running              : hostapd.isRunning(),
        scheduled            : scheduler.isScheduled(),
        scheduleInterval     : scheduler.getScheduleInterval(),
        lastRotationTimestamp: scheduler.getLastRotationTimestamp(),
        currentTimestamp     : Date.now(),
        currentBssid         : hostapd.getConfig('bssid'),
        currentSsid          : hostapd.getConfig('ssid'),
        percentage           : ((Date.now() - scheduler.getLastRotationTimestamp()) * 100 / scheduler.getScheduleInterval())
    }
}

io.on('connection', (socket) => {
    socket.on('ap-names', (fn) => {
        fn({list: data.getAPNames(), current: hostapd.getConfig('ssid')});
    });
    socket.on('mac-addresses', (fn) => {
        fn({list: data.getMacAddresses(), use: [hostapd.getConfig('bssid')]});
    });

    socket.on('hostapd-status', (fn) => {
        fn(compileInfo());
    });
    socket.on('ctrl-app-stop', () => {
        console.log("ctrl-app-stop");
        scheduler.cancelSchedule();
    });
    socket.on('ctrl-app-start', () => {
        console.log("ctrl-app-start");
        scheduler.schedule();
    });
    socket.on('set-temp-mac', (mac) => {
        hostapd.setBssid(mac);
        hostapd.restart();
    });
    socket.on('set-ssid', (ssid) => {
        hostapd.setSsid(ssid);
        hostapd.restart();
    });
});

hostapd.on('start', () => {
    io.emit('hostapd-start', compileInfo());
});
hostapd.on('exit', () => {
    io.emit('hostapd-exit', compileInfo());
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
};
