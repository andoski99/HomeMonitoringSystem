"""
This is a Flask application that controls fans and retrieves temperature data from sensors.
"""
from flask import Flask, render_template, jsonify, request
from Phidget22.Devices.DigitalOutput import *
from Phidget22.PhidgetException import *
from Phidget22.Phidget import *
from Phidget22.Net import *
from Phidget22.Devices.TemperatureSensor import *
from Phidget22.Devices.VoltageRatioInput import *
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.interval import IntervalTrigger
from Phidget22.Devices.HumiditySensor import *
import time
import requests
from apscheduler.jobstores.base import ConflictingIdError

# Create a scheduler to run tasks in the background
scheduler = BackgroundScheduler()
scheduler.start()

def turn_FT_ventilation_on():
    print("Turning FT ventilation on")
    activate_FT_ventilation(True)
    try:
        # Schedule turning FT ventilation off after 20 seconds
        scheduler.add_job(turn_FT_ventilation_off, 'interval', seconds=20, id='turn_FT_ventilation_off')
    except ConflictingIdError:
        # The job is already scheduled, no action needed
        pass

def turn_FT_ventilation_off():
    print("Turning FT ventilation off")
    activate_FT_ventilation(False)
    # Remove the job since we want to reschedule it on the next turn_FT_ventilation_on
    scheduler.remove_job('turn_FT_ventilation_off')


# Schedule turning FT ventilation on every 12 minutes
scheduler.add_job(turn_FT_ventilation_on, IntervalTrigger(seconds=40000))


# Device serial number
DEVICE_SERIAL_NUMBER = 597183

# Fan mapping configuration
fan_map = {
    "MTFan": {'hubport': 0, 'channel': 0},
    "GTFan": {'hubport': 0, 'channel': 1},
    "FTFan1": {'hubport': 0, 'channel': 2},
    "FTFan2": {'hubport': 0, 'channel': 3}
}

# Temperature sensor mapping configuration
temperature_map = {
    "GT_Temp": {'hubport': 1, 'channel': 0},
    "OT_Temp": {'hubport': 1, 'channel': 3},
    "FT_Temp": {'hubport': 5, 'channel': 0},
    "MT_Temp": {'hubport': 4, 'channel': 0}
}

humidity_map = {
    "FT_Humidity": {'hubport': 5, 'channel': 0}
}

# Create the Flask application
app = Flask(__name__)

# Store the initial state of the fan (False = off)
fan_states = {
    'GTVentilation': False,
    'FTVentilation': False
}


# # Schedule turning fans on every 10 minutes
# scheduler.add_job(turn_fans_on, IntervalTrigger(minutes=10))

# # Schedule turning fans off every 20 minutes
# scheduler.add_job(turn_fans_off, IntervalTrigger(minutes=20))


# Enable Phidget server discovery
Net.enableServerDiscovery(PhidgetServerType.PHIDGETSERVER_DEVICEREMOTE)

# Add Phidget server details
Net.addServer("ServerName", "192.168.20.193", 5661, "", 0)



def fan_control(fan_map, fan_name, state):
    """
    Controls the specified fan's state.

    Args:
        fan_map (dict): A dictionary mapping fan names to their hubport and channel.
        fan_name (str): The name of the fan to control.
        state (bool): The desired state of the fan (True for on, False for off).
    """

    do = DigitalOutput()
    do.setDeviceSerialNumber(DEVICE_SERIAL_NUMBER)
    do.setIsHubPortDevice(False)
    do.setHubPort(fan_map[fan_name]['hubport'])
    do.setChannel(fan_map[fan_name]['channel'])
    do.openWaitForAttachment(5000)
    do.setState(state)
    do.close()

def check_fan_state(fan_name):
    """
    Check the state of the specified fan.
    
    Args:
        fan_name (str): The name of the fan to check.
        
    Returns:
        (bool): True if the fan is on, False otherwise.
    """
    do = DigitalOutput()
    do.setDeviceSerialNumber(DEVICE_SERIAL_NUMBER)
    do.setIsHubPortDevice(False)
    do.setHubPort(fan_map[fan_name]['hubport'])
    do.setChannel(fan_map[fan_name]['channel'])
    do.openWaitForAttachment(5000)
    state = do.getState()
    do.close()
    return state

def activate_GT_ventilation(state):
    """
    Activates or deactivates the GT ventilation system by controlling the GT and MT fans.

    Args:
        state (bool): The desired state of the GT ventilation system (True for on, False for off).
    """
    fan_control(fan_map, 'MTFan', state)
    fan_control(fan_map, 'GTFan', state)

def activate_FT_ventilation(state):
    """
    Activates or deactivates the FT ventilation system by controlling the MT and FTFan2 fans.

    Args:
        state (bool): The desired state of the FT ventilation system (True for on, False for off).
    """
    fan_control(fan_map, 'MTFan', state)
    fan_control(fan_map, 'FTFan1', state)
 
def get_humidity_from_sensor(sensor_name):
    """
    Retrieves the humidity reading from the specified sensor.

    Args:
        sensor_name (str): The name of the humidity sensor.

    Returns:
        The humidity reading from the sensor.
    """
    hs = HumiditySensor()
    hs.setDeviceSerialNumber(DEVICE_SERIAL_NUMBER)
    hs.setIsHubPortDevice(False)
    hs.setHubPort(humidity_map[sensor_name]['hubport'])
    hs.setChannel(humidity_map[sensor_name]['channel'])
    hs.openWaitForAttachment(5000)
    humidity = hs.getHumidity()
    hs.close()
    return humidity

@app.route('/api/fan/group/GTVentilation', methods=['GET', 'POST'])
def GT_ventilation_fan_status():
    """
    Endpoint for getting or setting the status of the GT ventilation fans.

    Returns:
        A JSON response containing the current state of the GT ventilation fans.
    """
    if request.method == 'POST':
        state = request.json.get('state', None)
        if state is not None:
            activate_GT_ventilation(bool(state))
            fan_states['GTVentilation'] = bool(state)

    return jsonify({'state': fan_states['GTVentilation']})

@app.route('/api/fan/group/FTVentilation', methods=['GET', 'POST'])
def FT_ventilation_fan_status():
    """
    Endpoint for getting or setting the status of the FT ventilation fans.

    Returns:
        A JSON response containing the current state of the FT ventilation fans.
    """
    if request.method == 'POST':
        state = request.json.get('state', None)
        if state is not None:
            activate_FT_ventilation(bool(state))
            fan_states['FTVentilation'] = bool(state)
              
    return jsonify({'state': fan_states['FTVentilation']})


@app.route('/api/fan/<string:fanName>', methods=['GET', 'POST'])
def fan_status(fanName):
    """
    Endpoint for getting or setting the status of an individual fan.

    Args:
        fanName (str): The name of the fan.

    Returns:
        A JSON response containing the current state of the fan.
    """
    do = DigitalOutput()
    do.setDeviceSerialNumber(DEVICE_SERIAL_NUMBER)
    do.setIsHubPortDevice(False)
    do.setHubPort(fan_map[fanName]['hubport'])
    do.setChannel(fan_map[fanName]['channel'])
    do.openWaitForAttachment(5000)
    if request.method == 'POST':
        state = request.json.get('state', None)
        if state is not None :          
            do.setState(bool(state)).setState(bool(state))
    state = do.getState()
    do.close()
    return jsonify({'state': state})

def get_temperature_from_sensor(sensor_name):
    """
    Retrieves the temperature reading from the specified sensor.

    Args:
        sensor_name (str): The name of the temperature sensor.

    Returns:
        The temperature reading from the sensor.
    """
    ts = TemperatureSensor()
    ts.setDeviceSerialNumber(DEVICE_SERIAL_NUMBER)
    ts.setIsHubPortDevice(False)
    ts.setHubPort(temperature_map[sensor_name]['hubport'])
    ts.setChannel(temperature_map[sensor_name]['channel'])
    ts.openWaitForAttachment(5000)
    temperature = ts.getTemperature()
    ts.close()
    return temperature

@app.route('/api/temperature/<string:sensor_name>')
def get_temperature(sensor_name):
    """
    Endpoint for retrieving the temperature reading from a sensor.

    Args:
        sensor_name (str): The name of the temperature sensor.

    Returns:
        A JSON response containing the temperature reading from the sensor.
    """
    temperature = get_temperature_from_sensor(sensor_name)
    return jsonify({sensor_name: temperature})

@app.route('/api/humidity/<string:sensor_name>')
def get_humidity(sensor_name):
    """
    Endpoint for retrieving the humidity reading from a sensor.

    Args:
        sensor_name (str): The name of the humidity sensor.

    Returns:
        A JSON response containing the humidity reading from the sensor.
    """
    humidity = get_humidity_from_sensor(sensor_name)
    return jsonify({sensor_name: humidity})



@app.route('/')
def home():

    """
    Homepage endpoint.

    Returns:
        The rendered index.html template.
    """
    return render_template('index.html')


if __name__ == '__main__':
    # Run the Flask application
    app.run(debug=True, host='127.0.0.1', port=5001)

