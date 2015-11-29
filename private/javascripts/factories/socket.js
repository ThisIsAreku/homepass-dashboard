"use strict";
module.exports = /*@ngInject*/ ($log) => {
    $log.log("Loading socket");
    return io.connect();
};