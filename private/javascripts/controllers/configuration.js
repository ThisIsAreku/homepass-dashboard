"use strict";
module.exports = /*@ngInject*/ ($scope, $log, $socket) => {
    $scope.ssidList     = [];
    $scope.currentSsid  = null;
    $scope.bssidList    = [];
    $scope.bssidUseList = [];

    $socket.emit('ap-names', (ap) => {
        $log.log(ap);
        $scope.$apply(() => {
            $scope.currentSsid = ap.current;
            $scope.ssidList    = ap.list;
        });
    });

    $socket.emit('mac-addresses', (mac) => {
        $log.log(mac);
        $scope.$apply(() => {
            $scope.bssidUseList = mac.use;
            $scope.bssidList    = mac.list;
        });
    });

    $scope.setSsid = (elem) => {
        $socket.emit('set-ssid', elem.ssid.ap);
    }
};
