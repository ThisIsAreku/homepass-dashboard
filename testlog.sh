echo Configuration file: /home/pi/homepass-pi/run/hostapd.conf
echo Failed to update rate sets in kernel module
echo Using interface wlan0 with hwaddr 00:11:22:33:44:55 and ssid 'APNAME'
while true; do
    echo wlan0: AP-STA-CONNECTED BA:6A:CE:E7:4E:F1
    sleep 3
    echo wlan0: AP-STA-DISCONNECTED BA:6A:CE:E7:4E:F1
    echo wlan0: AP-STA-CONNECTED 3C:B2:81:20:DB:3D
    sleep 1
    echo wlan0: AP-STA-DISCONNECTED 3C:B2:81:20:DB:3D
    sleep 2
done;
