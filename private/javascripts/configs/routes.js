"use strict";
module.exports = /*@ngInject*/ ($routeProvider, $locationProvider) => {

    $routeProvider
    // Configuration
        .when("/configuration", {
            templateUrl: "/partials/configuration",
            controller : 'ConfigurationCtrl'
        })

        // Dashboard
        .when("/dashboard", {
            templateUrl: "/partials/dashboard",
            controller : 'DashboardCtrl'
        })

        // Default
        .otherwise({
            redirectTo: "/dashboard"
        });

    $locationProvider.html5Mode(true);
};