"use strict";
var express = require('express');
var hostapd = require('../src/hostapd');
var router = express.Router();

router.get('/partials/*', function (req, res, next) {
    res.render(req.params['0']);
});

router.get('*', function (req, res, next) {
    res.render('index');
});

module.exports = router;
