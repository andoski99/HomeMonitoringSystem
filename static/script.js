// Constants
const TEMP_HIGH = 20;
const TEMP_LOW = 19.9;

// Keep track of each fan's state
let fan1State = false; // Initially, fan 1 is off
let fan2State = false; // Initially, fan 2 is off

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
    // Turn on both fans if temperature is greater than or equal to TEMP_HIGH
    if (!fan1State) {
      turnFanOn(1);
    }
    if (!fan2State) {
      turnFanOn(2);
    }
  } else if (temperatureData.temperature <= TEMP_LOW) {
    // Turn off both fans if temperature is less than or equal to TEMP_LOW
    if (fan1State) {
      turnFanOff(1);
    }
    if (fan2State) {
      turnFanOff(2);
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

// Rest of your code...

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

// Example usage
window.onload = function () {
  getDeviceInfo(0); // Get device info for channel 0

  setInterval(updateTemperature, 5000); // Update temperature every 5 seconds
};
