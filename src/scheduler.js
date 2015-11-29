"use strict";
const hostapd = require('./hostapd');
const data = require('./data');

class Scheduler {
    constructor() {
        this.scheduler = null;
        this.lastRotationTimestamp = 0;
        this.macArchive = [];

        hostapd.setBssid('BA:6A:CE:E7:4E:F1');
        hostapd.setSsid('NintendoSpotPass1');
    }

    schedule() {
        this.cancelSchedule();

        var startupSequence = () => {
            let m = this.pickRandomMacAddress();
            hostapd.setBssid(m.mac);
            hostapd.buildConfigFile().then(() => {
                hostapd.start();
            }).catch((err) => {
                console.log(err);
            });
            this.lastRotationTimestamp = Date.now();
        };

        this.scheduler = setInterval(() => {
            hostapd.stop();
            startupSequence();
        }, this.getScheduleInterval());

        startupSequence();
    }

    cancelSchedule() {
        if (this.scheduler != null) {
            clearInterval(this.scheduler);
            this.scheduler = null;
            hostapd.stop();
        }
    }

    isScheduled() {
        return this.scheduler != null;
    }

    getScheduleInterval() {
        return 1000 * 30;
    }

    getLastRotationTimestamp() {
        return this.lastRotationTimestamp;
    }

    pickRandomMacAddress() {
        var m = null;
        var ok = true;
        do {
            m = data.getMacAddresses()[~~(Math.random() * data.getMacAddresses().length)];
            ok = true;
            for (let index = 0; index < this.macArchive.length; index++) {
                let elem = this.macArchive[index];
                if (elem.timestamp + 30 * 1000 < Date.now()) {
                    this.macArchive.splice(index, 1);
                    index--;

                    continue;
                }

                if (elem.mac == m.mac) {
                    ok = false;
                    break;
                }
            }
        } while (!ok);

        this.macArchive.push({mac: m.mac, timestamp: Date.now()});

        return m;
    }
}

const instance = new Scheduler();

module.exports = instance;