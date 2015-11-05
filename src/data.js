"use strict";
var fs = require('fs');

var cache = {};

module.exports = {
    "getAPNames": function() {
        return require('../data/ap_names.json');
    }
}
