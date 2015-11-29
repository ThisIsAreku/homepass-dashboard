"use strict";
module.exports = /*@ngInject*/ ($scope, $log, $socket) => {
    $scope.ssidList = [];
    $scope.bssidList = [];

    $socket.emit('ap-names', (ap) => {
        $scope.$apply(() => {
            $scope.ssidList = ap;
        });
    });
    $socket.emit('mac-addresses', (mac) => {
        $log.log(mac);
        $scope.$apply(() => {
            $scope.bssidList = mac;
        });
    });

    $scope.setApName = () => {

    }
};
