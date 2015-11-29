"use strict";
var app = window.app = angular.module('homepass-pi', [
    'ngRoute'
]);

app.filter('reverse', () => {
    return (items) => {
        return items.slice().reverse();
    };
});

/*app.config(['localStorageServiceProvider', (localStorageServiceProvider) => {
 localStorageServiceProvider.setPrefix('ls');
 }]);*/

app.config(require('./configs/routes.js'));

app.factory('$socket', require('./factories/socket.js'));

app.controller('ApplicationCtrl', require('./controllers/application.js'));
app.controller('DashboardCtrl', require('./controllers/dashboard.js'));
app.controller('ConfigurationCtrl', require('./controllers/configuration.js'));


app.controller('MenuBarCtrl', require('./controllers/menu_bar.js'));
app.controller('InfoBoxCtrl', require('./controllers/info_box.js'));
app.controller('LogBoxCtrl', require('./controllers/log_box.js'));


// legacy jQuery
jQuery.noConflict();
jQuery(require('./jquery/client.js'));