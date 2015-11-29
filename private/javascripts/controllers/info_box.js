"use strict";
module.exports = /*@ngInject*/ ($scope, $socket) => {
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

    setInterval(() => {
        if ($scope.hostapd.scheduleInterval == 0) {
            return;
        }

        var remaining = $scope.hostapd.lastRotationTimestamp + $scope.hostapd.scheduleInterval - Date.now();
        var percentage = (Date.now() - $scope.hostapd.lastRotationTimestamp) * 100 / $scope.hostapd.scheduleInterval;
        $scope.$apply(() => {
            $scope.hostapd.percentage = percentage;
            $scope.hostapd.remaining = remaining;
        });
    }, 1000);

    function applyStats(status) {
        $scope.$apply(() => {
            $scope.hostapd = status;
        });
    }

    $scope.toggleApp = () => {
        if ($scope.hostapd.scheduled) {
            $socket.emit('ctrl-app-stop');
        } else {
            $socket.emit('ctrl-app-start');
        }
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

    $socket.on('hostapd-update', (status) => {
        //applyStats(status);
    });
};