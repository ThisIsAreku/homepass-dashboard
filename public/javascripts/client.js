"use strict";
var socket = io.connect();
var connected = false;
var started = false;
var logColor = {
    'stderr': 'danger',
    'stdout': 'info'
};

// -----
// general
// -----
socket.on('connect', function () {
    connected = true;
    addLogMessage('success', 'sys', 'Connected to server');
    socket.emit('hostapd-status', function (status) {
        console.log('hostapd-status', status);
        setHostapdStatus(status);
    });
});
socket.on('disconnect', function () {
    connected = false;
    addLogMessage('danger', 'sys', 'Disconnected');
});

// -----
// hostapd
// -----
socket.on('hostapd-start', function (data) {
    setHostapdStatus(data);
    addLogMessage('info', 'hostapd', 'started');
    console.log('hostapd-start', data);

});
socket.on('hostapd-exit', function (data) {
    setHostapdStatus(data);
    addLogMessage('info', 'hostapd', 'exited');
    console.log('hostapd-exit', data);
});

socket.on('hostapd-data', function (data) {
    addLogMessage(logColor[data.type], 'hostapd', data.data);
    console.log('hostapd-data', data);
});

socket.on('hostapd-update', function (data) {
    addLogMessage('info', 'hostapd', 'restarted');
    console.log('hostapd-update', data);
});

socket.on('hostapd-connected', function (data) {
    addLogMessage('info', 'hostapd', 'C: ' + data.mac);
    console.log('hostapd-connected', data);
});

socket.on('hostapd-disconnected', function (data) {
    addLogMessage('info', 'hostapd', 'D: ' + data.mac);
    console.log('hostapd-disconnected', data);
});


$('#hostapd-toggle').click(function (e) {
    console.log(started);
    e.preventDefault();
    if (started) {
        socket.emit('ctrl-hostapd-stop');
    } else {
        socket.emit('ctrl-hostapd-start');
    }
});

$('.ctrl.require-conn').click(function (e) {
    if (!connected) {
        e.preventDefault();
        alert('Disconnected');
    }
});

function setHostapdStatus(status) {
    started = status.running;
    if (started) {
        $('#hostapd-toggle').removeClass('btn-primary').addClass('btn-danger').text('Stop');
        $('#hostapd-info').text(status.currentBssid + ' - ' + status.currentSsid);
    } else {
        $('#hostapd-toggle').addClass('btn-primary').removeClass('btn-danger').text('Start');
        $('#hostapd-info').text('');
    }
}

function addLogMessage(type, tag, msg) {
    var $tag = $('<span />', {
        'class': 'label label-' + (type == 'muted' ? 'default' : type),
        'title': moment().format('HH:mm:ss'),
        'text': tag
    });
    var $msg = $('<span />', {
        'class': 'text-' + type,
        'text': ' ' + msg
    });

    $('<li />').append($tag).append($msg).appendTo($('#log-list'));
    $tag.tooltip({
        placement: 'left'
    });
}