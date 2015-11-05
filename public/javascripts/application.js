/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/public/javascripts/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var app = window.app = angular.module('homepass-pi', ['ngRoute']);
	
	app.filter('reverse', () => {
	    return items => {
	        return items.slice().reverse();
	    };
	});
	
	/*app.config(['localStorageServiceProvider', (localStorageServiceProvider) => {
	    localStorageServiceProvider.setPrefix('ls');
	}]);*/
	
	app.config(__webpack_require__(1));
	
	app.factory('$socket', __webpack_require__(2));
	
	app.controller('ApplicationCtrl', __webpack_require__(3));
	app.controller('DashboardCtrl', __webpack_require__(4));
	app.controller('ConfigurationCtrl', __webpack_require__(5));

/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";
	
	module.exports = /*@ngInject*/($routeProvider, $locationProvider) => {
	
	    $routeProvider
	    // Configuration
	    .when("/configuration", {
	        templateUrl: "/partials/configuration",
	        controller: 'ConfigurationCtrl'
	    })
	
	    // Dashboard
	    .when("/dashboard", {
	        templateUrl: "/partials/dashboard",
	        controller: 'DashboardCtrl'
	    })
	
	    // Default
	    .otherwise({
	        redirectTo: "/dashboard"
	    });
	
	    $locationProvider.html5Mode(true);
	};

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = /*@ngInject*/() => {
	    "use strict";
	
	    var socket = io.connect();
	
	    return socket;
	};

/***/ },
/* 3 */
/***/ function(module, exports) {

	"use strict";
	
	module.exports = /*@ngInject*/($scope, $socket) => {
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
	        $socket.emit('hostapd-status', status => {
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

/***/ },
/* 4 */
/***/ function(module, exports) {

	"use strict";
	
	module.exports = /*@ngInject*/function ($scope, $socket) {};

/***/ },
/* 5 */
/***/ function(module, exports) {

	"use strict";
	
	module.exports = /*@ngInject*/($scope, $socket) => {
	    //$scope.ssidList = [{"ap":"wifine","zone":"JPN","company":"Wifin"},{"ap":"NintendoSpotPass1","zone":"EUR","company":"Nintendo"},{"ap":"NintendoSpotPass2","zone":"EUR","company":"Nintendo"},{"ap":"attwifi","zone":"USA","company":"AT&T"},{"ap":"SIMON WiFi","zone":"USA","company":"Simon Malls"},{"ap":"noasp01","zone":"USA","company":"NOA (Nintendo events)"},{"ap":"noasp02","zone":"USA","company":"NOA (Nintendo events)"},{"ap":"Telekom","zone":"EUR (Germany)","company":"Telekom"},{"ap":"Telekom_ICE","zone":"EUR (Germany)","company":"Telekom"},{"ap":"Guglielmo","zone":"IT","company":"Guglielmo"},{"ap":"ASTRO","zone":"IT","company":"Guglielmo"},{"ap":"Banca Sella WiFi Clienti","zone":"IT","company":"Guglielmo"},{"ap":"confindustria","zone":"IT","company":"Guglielmo"},{"ap":"Grand","zone":"IT","company":"Guglielmo"},{"ap":"Guglielmo Rimini WiFi","zone":"IT","company":"Guglielmo"},{"ap":"GuglielmoDallaRosaPrati","zone":"IT","company":"Guglielmo"},{"ap":"Hotels","zone":"IT","company":"Guglielmo"},{"ap":"L.Bettolo","zone":"IT","company":"Guglielmo"},{"ap":"LecceWireless","zone":"IT","company":"Guglielmo"},{"ap":"P.zza Nicoloso","zone":"IT","company":"Guglielmo"},{"ap":"PortoDiTrieste","zone":"IT","company":"Guglielmo"},{"ap":"Comune-Na Piazze WIFI","zone":"IT","company":"Guglielmo"},{"ap":"WiFi_Stampa","zone":"IT","company":"Guglielmo"},{"ap":"KPN","zone":"EUR (NL)","company":"KPN"},{"ap":"METEOR","zone":"FR","company":"Meteo"},{"ap":"MCDONALDS","zone":"FR","company":"Meteo"},{"ap":"AREA_by_METEOR","zone":"FR","company":"Meteo"},{"ap":"PATaPAIN_by_METEOR","zone":"FR","company":"Meteo"},{"ap":"CASINO_by_METEOR","zone":"FR","company":"Meteo"},{"ap":"all_seasons_by_METEOR","zone":"FR","company":"Meteo"},{"ap":"ADAGIO_by_METEOR","zone":"FR","company":"Meteo"},{"ap":"PULLMAN_by_METEOR","zone":"FR","company":"Meteo"},{"ap":"Best_Western_by_METEOR","zone":"FR","company":"Meteo"},{"ap":"CreditAgricole_by_METEOR","zone":"FR","company":"Meteo"},{"ap":"IBIS_by_METEOR","zone":"FR","company":"Meteo"},{"ap":"MERCURE_by_METEOR","zone":"FR","company":"Meteo"},{"ap":"Telefonica","zone":"ES","company":"Telefonic"},{"ap":"GOWEXWiFi","zone":"ES","company":"Gowex"},{"ap":"OurenseWiFi","zone":"ES","company":"Gowex"},{"ap":"RED_LIBRE_AVILES_WILOC","zone":"ES","company":"Gowex"},{"ap":"GIJON WIFI","zone":"ES","company":"Gowex"},{"ap":"01MIERESWIFI","zone":"ES","company":"Gowex"},{"ap":"01EibarWifi","zone":"ES","company":"Gowex"},{"ap":"WIFIBUR","zone":"ES","company":"Gowex"},{"ap":"ValladolidWiFi","zone":"ES","company":"Gowex"},{"ap":"01PuertoDelRosarioWiFi","zone":"ES","company":"Gowex"},{"ap":"PT-WIFI","zone":"PT","company":"PTWiF"},{"ap":"FON_ZON_FREE_INTERNET","zone":"PT","company":"ZON"},{"ap":"WiFi Zone - The Cloud","zone":"EUR (GB)","company":"The Cloud"},{"ap":"Mycloud","zone":"EUR (GB)","company":"The Cloud"},{"ap":"WLAN Zone - The Cloud","zone":"EUR (GB)","company":"The Cloud"},{"ap":"_The Cloud","zone":"EUR (GB)","company":"The Cloud"},{"ap":"FREESPOT","zone":"JPN","company":"FREESPOT"},{"ap":"TSUTAYA","zone":"JPN","company":"TSUTAYA"},{"ap":"Wayport_Access","zone":"USA","company":"McDonalds"},{"ap":"Boingo Hotspot","zone":"USA","company":"Boingo"},{"ap":"ibahn","zone":"USA","company":"iBAHN"},{"ap":"BELLWIFI@MCDONALDS","zone":"USA (Canada)","company":"Bell"},{"ap":"free-hotspot.com","zone":"EUR","company":"free-hotspot.com"},{"ap":"Bestbuy","zone":"USA","company":"Bestbuy"}];
	    $scope.ssidList = [];
	    $socket.emit('ap-names', ap => {
	        $scope.$apply(() => {
	            $scope.ssidList = ap;
	        });
	    });
	};

/***/ }
/******/ ]);
//# sourceMappingURL=application.js.map