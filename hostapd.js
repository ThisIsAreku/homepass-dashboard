var sudo         = require('sudo');
var os           = require('os');
var fs           = require('fs');
var merge        = require('merge');
var EventEmitter = require('events').EventEmitter;
var mixin        = require('merge-descriptors');

exports = module.exports = createHostapd;

function createHostapd () {
    mixin(this, EventEmitter.prototype, false);
    //events.EventEmitter.call(this);

    var p = this;
    var configFile = os.tmpdir() + 'hostapd.conf';
    var hostapdProcess;
    var running = false;

    this.defaultConfig = {
        "interface": "wlan0",
        "bridge": "br0",
        "driver": "nl80211",
        "ssid": "attwifi",
        //"bssid": %"bssid%",
        "hw_mode": "g",
        "channel": "6",
        "auth_algs": "1",
        "wpa": "0",
        "macaddr_acl": "1",
        //"accept_mac_file": %"accept_mac_file%",
        "ieee80211n": "1",
        "wmm_enabled": "0",
        "ignore_broadcast_ssid": "0",
    }
    this.currentConfig = {};

    this.start = function () {
        if (running) {
            return;
        }
        running = true;

        hostapdProcess = sudo(['ifconfig', configFile]);
        hostapdProcess.on('started', function () {
            p.emit('start');
        });
        hostapdProcess.stdout.on('data', function (data) {
            running = true;
            p.emit('data', {'type': 'strerr', 'data': data.toString()});
        });
        hostapdProcess.stderr.on('data', function (data) {
            running = true;
            p.emit('data', {'type': 'strerr', 'data': data.toString()});
        });
        hostapdProcess.on('exit', function (code, signal) {
            running = false;
            p.emit('exit');
        });
    }

    this.stop = function () {
        if (!running) {
            return;
        }

        hostapdProcess.kill();
    }

    this.restart = function () {
        p.stop();
        hostapdProcess.on('exit', function (code, signal) {
            p.start();
        });
    }

    this.setBssid = function (mac) {
        if (mac.match(/^([0-9A-F]{2}:){5}([0-9A-F]{2})$/i) !== null) {
            this.currentConfig['bssid'] = mac;
        }
    }

    this.buildConfigFile = function () {
        var finalConfig = merge(this.defaultConfig, this.currentConfig);
        var finalConfigText = '';
        Object.keys(finalConfig).forEach(function(key) {
            var val = finalConfig[key];
            finalConfigText += key + '=' + val + os.EOL;
        });

        fs.writeFile(configFile, finalConfigText, function(err) {
            if(err) {
                return console.log(err);
            }

            p.emit('update', configFile);
        });
    }

    this.isRunning = function () {
        return running;
    }

    return this;
}
