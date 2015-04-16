var socket = io.connect();
socket.on('hostapd-started', function (data) {
    console.log(data);
});
socket.on('hostapd-exit', function (data) {
    console.log(data);
});

socket.on('hostapd-data', function (data) {
    console.log(data);
});

socket.on('hostapd-update', function (data) {
    console.log(data);
});


$('#hostapd-start').click(function (e) {
    e.preventDefault();
    socket.emit('ctrl-hostapd-start');
})
