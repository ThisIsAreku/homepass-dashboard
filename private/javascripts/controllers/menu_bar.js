"use strict";
module.exports = /*@ngInject*/ ($scope, $location) => {
    $scope.isActive = function (viewLocation) {
        return $location.path().indexOf(viewLocation) == 0;
    };
};