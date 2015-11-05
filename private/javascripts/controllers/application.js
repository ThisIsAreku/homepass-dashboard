"use strict";
module.exports = /*@ngInject*/ ($scope, $socket) => {
    var logColor = {
        'stderr': 'danger',
        'stdout': 'info'
    };

    $scope.hostapd = {
        currentBssid: '',
        currentSsid: '',
        running: false
    };

    $scope.logs = /*localStorageService.get('logs') || */[];

    /*$scope.$watch('logs', () => {
     localStorageService.set('logs', $scope.logs);
     }, true);*/

    $socket.on('connect', () => {
        addLogMessage('success', 'sys', 'Connected to server');
        $socket.emit('hostapd-status', (status) => {
            $scope.$apply(() => {
                $scope.hostapd = status;
            });
            console.log('hostapd-status', status);
        });
    });

    $socket.on('disconnect', function () {
        addLogMessage('danger', 'sys', 'Disconnected');
    });

    $socket.on('hostapd-start', function (data) {
        $scope.$apply(() => {
            $scope.hostapd = data;
        });
        addLogMessage('info', 'hostapd', 'started');
        console.log('hostapd-start', data);

    });
    $socket.on('hostapd-exit', function (data) {
        $scope.$apply(() => {
            $scope.hostapd = data;
        });
        addLogMessage('info', 'hostapd', 'exited');
        console.log('hostapd-exit', data);
    });

    $socket.on('hostapd-data', function (data) {
        addLogMessage(logColor[data.type], 'hostapd', data.data);
        console.log('hostapd-data', data);
    });

    $socket.on('hostapd-update', function (data) {
        addLogMessage('info', 'hostapd', 'restarted');
        console.log('hostapd-update', data);
    });

    $socket.on('hostapd-connected', function (data) {
        addLogMessage('info', 'hostapd', 'C: ' + data.mac);
        console.log('hostapd-connected', data);
    });

    $socket.on('hostapd-disconnected', function (data) {
        addLogMessage('info', 'hostapd', 'D: ' + data.mac);
        console.log('hostapd-disconnected', data);
    });

    $scope.toggleHostapd = () => {
        if ($scope.hostapd.running) {
            $socket.emit('ctrl-hostapd-stop');
        } else {
            $socket.emit('ctrl-hostapd-start');
        }
    };


    function addLogMessage(type, tag, msg) {
        $scope.$apply(() => {
            $scope.logs.push({
                type: type,
                date: moment().format('HH:mm:ss'),
                tag: tag,
                msg: msg
            });
        });
    }
};
