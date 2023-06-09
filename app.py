from flask import Flask, render_template, jsonify, request
from Phidget22.Devices.DigitalOutput import *
from Phidget22.PhidgetException import *
from Phidget22.Phidget import *
from Phidget22.Net import *

from Phidget22.Devices.TemperatureSensor import *

def get_temperature_from_sensor():
    ts = TemperatureSensor()

    # Set the device's addressing parameters
    ts.setDeviceSerialNumber(592507)  # Replace with your device's serial number
    ts.setIsHubPortDevice(False)  # Set to True if the device is connected to a VINT Hub port
    ts.setHubPort(2)  # Replace with your device's hub port

    ts.openWaitForAttachment(5000)  # Wait for attach

    # Get the temperature
    temperature = ts.getTemperature()

    # Close the device
    ts.close()

    return temperature


Net.enableServerDiscovery(PhidgetServerType.PHIDGETSERVER_DEVICEREMOTE)
Net.addServer("ServerName", "192.168.0.252", 5661, "", 0)

app = Flask(__name__)

# Define the fan_map dictionary
fan_map = {
    0: {'serial': 592507, 'channel': 0, 'hubport': 0},
    1: {'serial': 592507, 'channel': 0, 'hubport': 3},
}


@app.route('/')
def home():
    return render_template('index.html')


@app.route('/api/fan/<int:fanNumber>', methods=['GET', 'POST'])
def fan_status(fanNumber):
    # Create a digital output
    do = DigitalOutput()

    # Set the device's addressing parameters
    do.setDeviceSerialNumber(fan_map[fanNumber - 1]['serial'])
    do.setIsHubPortDevice(True)
    do.setHubPort(fan_map[fanNumber - 1]['hubport'])

    do.openWaitForAttachment(5000)  # Wait for attach

    if request.method == 'POST':
        # Get the state from the request
        state = request.json.get('state', None)

        if state is not None:
            do.setState(bool(state))  # Update the state of the digital output

    # Get the state
    state = do.getState()

    # Close the device
    do.close()

    # Return the state
    return jsonify({'state': state})


@app.route('/api/temperature')
def get_temperature():
    # Retrieve the temperature from the temperature sensor
    temperature = get_temperature_from_sensor()

    # Return the temperature as JSON response
    return jsonify({'temperature': temperature})



if __name__ == '__main__':
    app.run(debug=True, host='127.0.0.1', port=5001)
