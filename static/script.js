// Constants
const TEMP_HIGH = 20;
const TEMP_LOW = 19.9;

// Keep track of each fan's state
let fan1State = false; // Initially, fan 1 is off
let fan2State = false; // Initially, fan 2 is off

const FAN_2_ON_TIME = 50000; // Time in milliseconds
const FAN_2_OFF_TIME = 20000; // Time in milliseconds

async function updateTemperature() {
  const response = await fetch("/api/temperature");
  const temperatureData = await response.json();

  // Display the fetched temperature value
  document.getElementById(
    "temperatureValue"
  ).textContent = `Temperature Value: ${temperatureData.temperature}°C`;

  setTemperatureRedFluid(temperatureData.temperature);

  // Fan control
  if (temperatureData.temperature >= TEMP_HIGH) {
    // Only control Fan 1 based on temperature
    if (!fan1State) {
      turnFanOn(1);
    }
  } else if (temperatureData.temperature <= TEMP_LOW) {
    // Only control Fan 1 based on temperature
    if (fan1State) {
      turnFanOff(1);
    }
  }
}

async function turnFanOn(fanNumber) {
  const fanStatus = document.getElementById(`fan${fanNumber}Status`);
  const fanCircle = document.getElementById(`fan${fanNumber}Circle`);

  const response = await fetch(`/api/fan/${fanNumber}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ state: true }),
  });

  const json = await response.json();

  if (json.state) {
    fanStatus.textContent = "On";
    fanCircle.style.backgroundColor = "green";
    if (fanNumber === 1) {
      fan1State = true;
    } else if (fanNumber === 2) {
      fan2State = true;
    }
  }
}

function startFan2Timer() {
  // Turn Fan 2 on and set it to turn off after FAN_2_ON_TIME
  console.log("Turning on Fan 2");
  turnFanOn(2);
  fan2State = true;

  setTimeout(() => {
    // Now turn off Fan 2 and set it to turn on after FAN_2_OFF_TIME
    console.log("Turning off Fan 2");
    turnFanOff(2);
    fan2State = false;

    setTimeout(() => {
      // Once fan 2 is turned off, wait for FAN_2_OFF_TIME and start the process again
      startFan2Timer();
    }, FAN_2_OFF_TIME);
  }, FAN_2_ON_TIME);
}

async function turnFanOff(fanNumber) {
  const fanStatus = document.getElementById(`fan${fanNumber}Status`);
  const fanCircle = document.getElementById(`fan${fanNumber}Circle`);

  const response = await fetch(`/api/fan/${fanNumber}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ state: false }),
  });

  const json = await response.json();

  if (!json.state) {
    fanStatus.textContent = "Off";
    fanCircle.style.backgroundColor = "grey";
    if (fanNumber === 1) {
      fan1State = false;
    } else if (fanNumber === 2) {
      fan2State = false;
    }
  }
}

async function getDeviceInfo() {
  const response = await fetch(`/api/device-info/${0}`);
  const deviceInfo = await response.json();

  let deviceInfoString = "";
  for (const property in deviceInfo) {
    deviceInfoString += `${property}: ${deviceInfo[property]}<br>`;
  }
  document.getElementById("deviceInfo").innerHTML = deviceInfoString;

  // Get and display the temperature
  updateTemperature();
}

function setTemperatureRedFluid(temperature) {
  const redFluid = document.getElementById("redFluid");
  const maxTemperature = 40; // Maximum temperature on the scale
  const minTemperature = 10; // Minimum temperature on the scale
  const maxHeight = 100; // Maximum height of the fluid in percentage

  // Calculate the height of the red fluid based on the temperature
  const heightPercentage =
    ((temperature - minTemperature) / (maxTemperature - minTemperature)) *
    maxHeight;
  redFluid.style.height = `${heightPercentage}%`;
}

async function updateSoundLevel() {
  const response = await fetch("/api/sound");
  const soundData = await response.json();

  // Display the fetched sound level value
  document.getElementById(
    "soundLevelValue"
  ).textContent = `${soundData.soundLevel.toFixed(2)} dB`;
}

// Example usage
window.onload = function () {
  getDeviceInfo(0); // Get device info for channel 0
  startFan2Timer(); // Start the timer for Fan 2
  setInterval(updateTemperature, 5000); // Update temperature every 5 seconds
  setInterval(updateSoundLevel, 5000); // Update sound level every 5 seconds
};
