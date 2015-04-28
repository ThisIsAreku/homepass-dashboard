var fs = require('fs');

var cache = {};

exports = module.exports = {
    "getAPNames": function() {
        return require('../data/ap_names.json');
    }
}
