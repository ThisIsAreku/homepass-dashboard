var sudo         = require('sudo');
var os           = require('os');
var fs           = require('fs');
var merge        = require('merge');
var EventEmitter = require('events').EventEmitter;
var mixin        = require('merge-descriptors');

exports = module.exports = function () {
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

        // hostapdProcess = sudo(['ifconfig', configFile]);
        // debug
        hostapdProcess = require('child_process').spawn('cat', ['testlog.txt']);
        hostapdProcess.on('started', function () {
            p.emit('start');
        });
        hostapdProcess.stdout.on('data', function (data) {
            running = true;
            data.toString().split('\n').forEach(function (line) {
                if (line == '') {
                    return;
                }
                
                var re = /([a-z0-9]+): AP-STA-((?:DIS)?CONNECTED) ((?:[0-9a-f]{2}:){5}(?:[0-9a-f]{2}))/i; 
                var str = line;
                var m;
                 
                if ((m = re.exec(str)) !== null) {
                    if (m.index === re.lastIndex) {
                        re.lastIndex++;
                    }

                    p.emit(m[2].toLowerCase(), {'interface': m[1], 'mac': m[3]});
                } else {
                    p.emit('data', {'type': 'stdout', 'data': line});
                }
            })
        });
        hostapdProcess.stderr.on('data', function (data) {
            running = true;
            p.emit('data', {'type': 'stderr', 'data': data.toString()});
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

    this.getConfig = function (key) {
        var finalConfig = merge(this.defaultConfig, this.currentConfig);
        return finalConfig[key];
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

    this.cleanup = function () {
        fs.unlinkSync(configFile);
    }

    return this;
}
