var socketio = require('socket.io');
var app = require('./app');
var data = require('./data');
var io = socketio(app.getServer());

io.on('connection', function (socket) {
    socket.emit('ap-names', data.getAPNames());

    socket.on('ctrl-hostapd-stop', function () {
        app.getHostapd().stop();
    });
    socket.on('ctrl-hostapd-start', function () {
        app.getHostapd().start();
    });
    socket.on('set-temp-mac', function (mac) {
        app.getHostapd().setBssid(mac);
        app.getHostapd().restart();
    });
});

app.getHostapd().on('start', function () {
    io.emit('hostapd-start');
});
app.getHostapd().on('exit', function () {
    io.emit('hostapd-exit');
});
app.getHostapd().on('data', function (data) {
    io.emit('hostapd-data', data);
});
app.getHostapd().on('connected', function (data) {
    io.emit('hostapd-connected', data);
});
app.getHostapd().on('disconnected', function (data) {
    io.emit('hostapd-disconnected', data);
});
app.getHostapd().on('update', function (configFile) {
    io.emit('hostapd-update', configFile);
});

setInterval(function () {
    io.emit('sync', (new Date).getTime());
}, 5e3);


exports = module.exports = {
    "cleanup": function () {
        console.log("cleanup");
    }
}
