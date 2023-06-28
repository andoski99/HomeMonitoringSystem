import { eventDispatcher } from "./EventDispatcher.js";

// Store the last temperature and the time at which the last event was dispatched
let lastTemperature = null;
let lastDispatchTime = null;

// Define the minimum change in temperature and the minimum interval between dispatches
const MIN_TEMPERATURE_CHANGE = 0.1; // The minimum change in temperature for an event to be dispatched
const MIN_DISPATCH_INTERVAL = 10000; // The minimum time between dispatches (in milliseconds)

// Function to fetch and process new temperature data
export async function updateTemperature() {
  // Fetch the latest temperature data
  const response = await fetch("/api/temperature");
  const temperatureData = await response.json();

  // Get the current time
  const now = Date.now();

  // Check if the temperature has changed by at least MIN_TEMPERATURE_CHANGE and if at least MIN_DISPATCH_INTERVAL milliseconds have passed since the last event
  if (
    (lastTemperature === null ||
      Math.abs(temperatureData.temperature - lastTemperature) >=
        MIN_TEMPERATURE_CHANGE) &&
    (lastDispatchTime === null ||
      now - lastDispatchTime >= MIN_DISPATCH_INTERVAL)
  ) {
    // If both conditions are met, dispatch a 'temperatureChanged' event and update the last temperature and the time of the last dispatch
    eventDispatcher.dispatch("temperatureChanged", temperatureData.temperature);
    lastTemperature = temperatureData.temperature;
    lastDispatchTime = now;
  }

  // Display the fetched temperature values
  document.getElementById(
    "temperatureValue"
  ).textContent = `Temperature Value: ${temperatureData.temperature}°C`;
  document.getElementById(
    "GH_tempValue"
  ).textContent = `GH_temp: ${temperatureData.GH_temp}°C`;

  setTemperatureRedFluid(temperatureData.temperature);
  setGH_tempRedFluid(temperatureData.GH_temp);
}

// Function to fetch and display GH_temp
export async function updateGH_temp() {
  const response = await fetch("/api/temperature/GH_temp");
  const temperatureData = await response.json();

  // Display the fetched GH_temp temperature value
  document.getElementById(
    "GH_tempValue"
  ).textContent = `GH_temp Value: ${temperatureData.temperature}°C`;

  setGH_tempRedFluid(temperatureData.temperature);
}
// Function to connect to GH_temp and start the temperature updates
export async function connectGH_temp() {
  const response = await fetch(`/api/device-info/${1}`);
  const deviceInfo = await response.json();

  // Display the fetched device info
  let deviceInfoString = "";
  for (const property in deviceInfo) {
    deviceInfoString += `${property}: ${deviceInfo[property]}<br>`;
  }
  document.getElementById("deviceInfo").innerHTML = deviceInfoString;

  setInterval(updateGH_temp, 5000); // Update temperature every 5 seconds for GH_temp sensor
}

