"use strict";
module.exports = /*@ngInject*/ ($scope, $socket, $log) => {
    var refreshInterval = null;
    $scope.hostapd = {
        running: false,
        scheduled: false,
        scheduleInterval: 0,
        lastRotationTimestamp: 0,
        currentBssid: '',
        currentSsid: '',
        percentage: 0,
        remaining: 0
    };

    function applyStats(status) {
        $log.log('Applying new status', status);
        $scope.$apply(() => {
            $scope.hostapd = status;
        });
    }

    $scope.toggleApp = () => {
        if ($scope.hostapd.scheduled || $scope.hostapd.running) {
            $socket.emit('ctrl-app-stop');
        } else {
            $socket.emit('ctrl-app-start');
        }
    };

    $scope.refreshApp = () => {
        $socket.emit('hostapd-status', (status) => {
            applyStats(status);
        });
    };

    $socket.on('connect', () => {
        $socket.emit('hostapd-status', (status) => {
            applyStats(status);
        });
    });

    $socket.on('hostapd-start', (status) => {
        applyStats(status);
    });

    $socket.on('hostapd-exit', (status) => {
        applyStats(status);
    });
};