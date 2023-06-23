from flask import Flask, render_template, jsonify, request
from Phidget22.Devices.DigitalOutput import *
from Phidget22.PhidgetException import *
from Phidget22.Phidget import *
from Phidget22.Net import *
from Phidget22.Devices.TemperatureSensor import *
from Phidget22.Devices.VoltageRatioInput import *


# Define the serial number for your devices
DEVICE_SERIAL_NUMBER = 597183

# Define a dictionary for each sensor
fan_map = {
    "MTFan": {'hubport': 0, 'channel': 0},
    "GTFan": {'hubport': 0, 'channel': 1},
    "FTFan1": {'hubport': 0, 'channel': 2},
    "FTFan2": {'hubport': 0, 'channel': 3},
}

temperature_map = {
    "GT_Temp": {'hubport': 1, 'channel': 0},
    "OT_Temp": {'hubport': 1, 'channel': 3},
    "FT_Temp": {'hubport': 5, 'channel': 0},
    "MT_Temp": {'hubport': 4, 'channel': 0},
}

# Initialize Flask app
app = Flask(__name__)

# Enable network discovery
Net.enableServerDiscovery(PhidgetServerType.PHIDGETSERVER_DEVICEREMOTE)
Net.addServer("ServerName", "192.168.20.193", 5661, "", 0)

# Define functions to get temperature from each sensor
def get_temperature_from_sensor(sensor_name):
    ts = TemperatureSensor()
    ts.setDeviceSerialNumber(DEVICE_SERIAL_NUMBER)
    ts.setIsHubPortDevice(True)  
    ts.setHubPort(temperature_map[sensor_name]['hubport'])  
    ts.setChannel(temperature_map[sensor_name]['channel'])
    ts.openWaitForAttachment(5000)  # Wait for attach
    temperature = ts.getTemperature()
    ts.close()
    return temperature


# Add home route to serve the HTML page
@app.route('/')
def home():
    return render_template('index.html')


# Define functions to control each fan
@app.route('/api/fan/<string:fanName>', methods=['GET', 'POST'])
def fan_status(fanName):
    do = DigitalOutput()
    do.setDeviceSerialNumber(DEVICE_SERIAL_NUMBER)
    do.setIsHubPortDevice(True)
    do.setHubPort(fan_map[fanName]['hubport'])
    do.setChannel(fan_map[fanName]['channel'])
    do.openWaitForAttachment(5000)  # Wait for attach

    if request.method == 'POST':
        state = request.json.get('state', None)
        if state is not None:
            do.setState(bool(state))  
    state = do.getState()
    do.close()
    return jsonify({'state': state})

# Define route for each temperature sensor
@app.route('/api/temperature/<string:sensor_name>')
def get_temperature(sensor_name):
    temperature = get_temperature_from_sensor(sensor_name)
    return jsonify({sensor_name: temperature})

if __name__ == '__main__':
    app.run(debug=True, host='127.0.0.1', port=5001)
