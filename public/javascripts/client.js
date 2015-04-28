var socket = io.connect();
var connected = false;
var logColor = {
    'stderr': 'danger',
    'stdout': 'info'
}
// -----
// general
// -----
socket.on('connect', function () {
    connected = true;
    addLogMessage('success', 'sys', 'Connected to server');
});
socket.on('disconnect', function () {
    connected = false;
    addLogMessage('danger', 'sys', 'Disconnected');
});
socket.on('sync', function (ts) {
    var diff = (new Date).getTime() - ts;
    // addLogMessage('muted', 'sys', 'Diff time: ' + diff+' ms');
});
// -----
// init
// -----
socket.on('ap-names', function (data) {
    console.log(data);
})

// -----
// hostapd
// -----
socket.on('hostapd-started', function (data) {
    addLogMessage('info', 'hostapd', 'started');
    console.log(data);
});
socket.on('hostapd-exit', function (data) {
    addLogMessage('info', 'hostapd', 'exited');
    console.log(data);
});

socket.on('hostapd-data', function (data) {
    addLogMessage(logColor[data.type], 'hostapd', data.data);
    console.log(data);
});

socket.on('hostapd-update', function (data) {
    addLogMessage('info', 'hostapd', 'restarted');
    console.log(data);
});

socket.on('hostapd-connected', function (data) {
    addLogMessage('info', 'hostapd', 'C: '+data.mac);
    console.log(data);
});

socket.on('hostapd-disconnected', function (data) {
    addLogMessage('info', 'hostapd', 'D: '+data.mac);
    console.log(data);
});



$('#hostapd-start').click(function (e) {
    e.preventDefault();
    socket.emit('ctrl-hostapd-start');
});

$('.ctrl.require-conn').click(function (e) {
    if (!connected) {
        e.preventDefault();
        alert('Disconnected');
    }
})


function addLogMessage(type, tag, msg) {
    var $tag = $('<span />', {
        'class': 'label label-'+(type=='muted' ? 'default' : type),
        'title': moment().format('HH:mm:ss'),
        'text': tag
    });
    var $msg = $('<span />', {
        'class': 'text-'+type,
        'text': ' '+msg
    });

    $('<li />').append($tag).append($msg).appendTo($('#log-list'));
    $tag.tooltip({
        placement: 'left'
    });
}
