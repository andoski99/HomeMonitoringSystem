async function toggleFan(fanNumber) {
  const fanStatus = document.getElementById(`fan${fanNumber}Status`);
  const fanCircle = document.getElementById(`fan${fanNumber}Circle`);

  const newState = fanStatus.textContent === "Off";

  const response = await fetch(`/api/fan/${fanNumber}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ state: newState }),
  });

  const json = await response.json();

  if (json.state) {
    fanStatus.textContent = "On";
    fanCircle.style.backgroundColor = "green";
  } else {
    fanStatus.textContent = "Off";
    fanCircle.style.backgroundColor = "grey";
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

async function updateTemperature() {
  const response = await fetch("/api/temperature");
  const temperatureData = await response.json();

  setTemperatureRedFluid(temperatureData.temperature);
}

async function updateTemperature() {
  const response = await fetch("/api/temperature");
  const temperatureData = await response.json();

  // Display the fetched temperature value
  document.getElementById(
    "temperatureValue"
  ).textContent = `Temperature Value: ${temperatureData.temperature}°C`;

  setTemperatureRedFluid(temperatureData.temperature);
}

// Example usage
window.onload = function () {
  getDeviceInfo(0); // Get device info for channel 0

  setInterval(updateTemperature, 5000); // Update temperature every 5 seconds
};
