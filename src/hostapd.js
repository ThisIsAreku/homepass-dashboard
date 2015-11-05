"use strict";
var sudo = require('sudo');
var os = require('os');
var fs = require('fs');
var merge = require('merge');
var EventEmitter = require('events').EventEmitter;
var mixin = require('merge-descriptors');

class Hostapd extends EventEmitter {
    constructor() {
        super();

        this.configFile = os.tmpdir() + '/hostapd.conf';
        this.hostapdProcess = null;
        this.running = false;

        this.defaultConfig = {
            "interface": "wlan0",
            "bridge": "br0",
            "driver": "nl80211",
            "ssid": null,
            "bssid": null,
            "hw_mode": "g",
            "channel": "6",
            "auth_algs": "1",
            "wpa": "0",
            "macaddr_acl": "1",
            //"accept_mac_file": %"accept_mac_file%",
            "ieee80211n": "1",
            "wmm_enabled": "0",
            "ignore_broadcast_ssid": "0"
        };
        this.currentConfig = {};

    }

    start() {
        if (this.running) {
            return;
        }
        this.running = true;

        // hostapdProcess = sudo(['ifconfig', configFile]);
        // debug
        this.hostapdProcess = require('child_process').spawn('./testlog.sh');
        var firstData = true;
        this.hostapdProcess.stdout.on('data', (data) => {
            this.running = true;
            if (firstData) {
                firstData = false;
                this.emit('start');
            }

            data.toString().split('\n').forEach((line) => {
                if (line == '') {
                    return;
                }

                var re = /([a-z0-9]+): AP-STA-((?:DIS)?CONNECTED) ((?:[0-9a-f]{2}:){5}(?:[0-9a-f]{2}))/i;
                var m;
                if ((m = re.exec(line)) !== null) {
                    if (m.index === re.lastIndex) {
                        re.lastIndex++;
                    }

                    this.emit(m[2].toLowerCase(), {'interface': m[1], 'mac': m[3]});
                } else {
                    this.emit('data', {'type': 'stdout', 'data': line});
                }
            })
        });
        this.hostapdProcess.stderr.on('data', (data) => {
            this.running = true;
            this.emit('data', {'type': 'stderr', 'data': data.toString()});
        });
        this.hostapdProcess.on('exit', (code, signal) => {
            this.running = false;
            this.emit('exit');
        });
    }

    stop() {
        if (!this.running) {
            return;
        }

        this.hostapdProcess.kill();
    }

    restart() {
        this.stop();
        this.hostapdProcess.on('exit', (code, signal) => {
            this.start();
        })
        ;
    }

    setBssid(mac) {
        if (mac.match(/^([0-9A-F]{2}:){5}([0-9A-F]{2})$/i) !== null) {
            this.currentConfig['bssid'] = mac;
        }
    }

    setSsid(ssid) {
        this.currentConfig['ssid'] = ssid;
    }

    getConfig(key) {
        var finalConfig = merge(this.defaultConfig, this.currentConfig);
        return finalConfig[key];
    }

    buildConfigFile() {
        var finalConfig = merge(this.defaultConfig, this.currentConfig);
        var finalConfigText = '';
        Object.keys(finalConfig).forEach((key) => {
            var val = finalConfig[key];
            finalConfigText += key + '=' + val + os.EOL;
        })
        ;

        fs.writeFile(this.configFile, finalConfigText, (err) => {
            if (err) {
                return console.log(err);
            }

            this.emit('update', this.configFile);
        })
        ;
    }

    isRunning() {
        return this.running;
    }

    cleanup() {
        fs.access(this.configFile, fs.R_OK | fs.W_OK, (err) => {
            if (!err) {
                fs.unlink(this.configFile, () => {

                });
            }
        })
    }
}

var instance = new Hostapd();

module.exports = instance;
