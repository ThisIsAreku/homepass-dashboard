"use strict";
module.exports = /*@ngInject*/ ($scope, $log, $socket) => {
    var logColor = {
        'stderr': 'danger',
        'stdout': 'info'
    };
    $scope.logs = /*localStorageService.get('logs') || */[];


    var addLogMessage = (type, tag, msg) => {
        $scope.$apply(() => {
            $scope.logs.push({
                type: type,
                date: moment().format('HH:mm:ss'),
                tag: tag,
                msg: msg
            });
        });
    };

    $scope.addLogMessage = addLogMessage;

    /*$scope.$watch('logs', () => {
     localStorageService.set('logs', $scope.logs);
     }, true);*/

    $socket.on('connect', () => {
        addLogMessage('success', 'sys', 'Connected to src');
    });

    $socket.on('disconnect', function () {
        addLogMessage('danger', 'sys', 'Disconnected');
    });

    $socket.on('hostapd-start', function (data) {
        addLogMessage('info', 'hostapd', 'started');
        $log.log('hostapd-start', data);
    });
    $socket.on('hostapd-exit', function (data) {
        addLogMessage('info', 'hostapd', 'exited');
        $log.log('hostapd-exit', data);
    });


    $socket.on('hostapd-data', function (data) {
        addLogMessage(logColor[data.type], 'hostapd', data.data);
        $log.log('hostapd-data', data);
    });

    $socket.on('hostapd-update', function (data) {
        addLogMessage('info', 'hostapd', 'restarted');
        $log.log('hostapd-update', data);
    });

    $socket.on('hostapd-connected', function (data) {
        addLogMessage('info', 'hostapd', 'C: ' + data.mac);
        $log.log('hostapd-connected', data);
    });

    $socket.on('hostapd-disconnected', function (data) {
        addLogMessage('info', 'hostapd', 'D: ' + data.mac);
        $log.log('hostapd-disconnected', data);
    });
};
