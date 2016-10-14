"use strict";
module.exports = /*@ngInject*/ ($scope, $socket, $log) => {
    $scope.hostapd = {
        running              : false,
        scheduled            : false,
        scheduleInterval     : 0,
        currentTimestamp     : 0,
        lastRotationTimestamp: 0,
        currentBssid         : '',
        currentSsid          : '',
        percentage           : 0,
        remaining            : 0
    };

    var refreshInterval = setInterval(() => {
        $scope.$apply(() => {
            $scope.hostapd.remaining  = ($scope.hostapd.lastRotationTimestamp + $scope.hostapd.scheduleInterval) - Date.now();
            $scope.hostapd.percentage = ((Date.now() - $scope.hostapd.lastRotationTimestamp) * 100 / $scope.hostapd.scheduleInterval);
        });
    }, 1000);

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