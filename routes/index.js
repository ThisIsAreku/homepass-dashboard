var express = require('express');
var app = require('../src/app');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Hello !', hostapd_running: app.getHostapd().isRunning() });
});

router.get('/configuration', function(req, res, next) {
  res.render('configuration', { title: 'Configuration' });
});

module.exports = router;
