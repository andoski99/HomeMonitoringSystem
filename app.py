from flask import Flask, render_template, jsonify, request
from Phidget22.Devices.DigitalOutput import *
from Phidget22.PhidgetException import *
from Phidget22.Phidget import *
from Phidget22.Net import *
from Phidget22.Devices.TemperatureSensor import *
from Phidget22.Devices.VoltageRatioInput import *

def get_temperature_from_sensor():
    ts = TemperatureSensor()
    ts.setDeviceSerialNumber(592507)  # Replace with your device's serial number
    ts.setIsHubPortDevice(False)  
    ts.setHubPort(2)  
    ts.openWaitForAttachment(5000)  # Wait for attach
    temperature = ts.getTemperature()
    ts.close()
    return temperature

def get_sound_level_from_sensor():
    ss = VoltageRatioInput()
    ss.setDeviceSerialNumber(592507)  # Replace with your device's serial number
    ss.setIsHubPortDevice(True)  
    ss.setHubPort(1)  # Replace with your device's hub port
    ss.openWaitForAttachment(5000)  # Wait for attach
    sound_level = ss.getVoltageRatio()
    ss.close()
    return sound_level

Net.enableServerDiscovery(PhidgetServerType.PHIDGETSERVER_DEVICEREMOTE)
Net.addServer("ServerName", "192.168.0.252", 5661, "", 0)

app = Flask(__name__)

fan_map = {
    0: {'serial': 592507, 'channel': 0, 'hubport': 0},
    1: {'serial': 592507, 'channel': 0, 'hubport': 3},
}

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/api/fan/<int:fanNumber>', methods=['GET', 'POST'])
def fan_status(fanNumber):
    do = DigitalOutput()
    do.setDeviceSerialNumber(fan_map[fanNumber - 1]['serial'])
    do.setIsHubPortDevice(True)
    do.setHubPort(fan_map[fanNumber - 1]['hubport'])
    do.openWaitForAttachment(5000)  # Wait for attach

    if request.method == 'POST':
        state = request.json.get('state', None)
        if state is not None:
            do.setState(bool(state))  
    state = do.getState()
    do.close()
    return jsonify({'state': state})

@app.route('/api/temperature')
def get_temperature():
    temperature = get_temperature_from_sensor()
    return jsonify({'temperature': temperature})

@app.route('/api/sound')
def get_sound():
    sound_level = get_sound_level_from_sensor()
    return jsonify({'sound': sound_level})

if __name__ == '__main__':
    app.run(debug=True, host='127.0.0.1', port=5001)
