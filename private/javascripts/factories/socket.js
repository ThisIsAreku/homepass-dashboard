module.exports = /*@ngInject*/  ()  => {
    "use strict";
    var socket = io.connect();


    return socket;
};