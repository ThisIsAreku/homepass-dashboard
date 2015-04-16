module.exports = function (app, hostapd) {
    var io = require('socket.io')(app);

    io.on('connection', function (socket) {
        socket.on('ctrl-hostapd-stop', function () {
            hostapd.stop();
        });
        socket.on('ctrl-hostapd-start', function () {
            hostapd.start();
        });
        socket.on('set-temp-mac', function (mac) {
            hostapd.setBssid(mac);
            hostapd.restart();
        });
    });

    hostapd.on('start', function () {
        io.emit('hostapd-start');
    });
    hostapd.on('exit', function () {
        io.emit('hostapd-exit');
    });
    hostapd.on('data', function (data) {
        io.emit('hostapd-data', data);
    });
    hostapd.on('update', function (configFile) {
        io.emit('hostapd-update', configFile);
    });
}
