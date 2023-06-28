// This js file covers the functions of the fans in the mushroom tents.


import { eventDispatcher } from "./EventDispatcher.js";

// Add listener for temperature change
eventDispatcher.addListener("temperatureChanged", checkTemperatureAndAdjustFan);

// Constants for temperature thresholds
const TEMP_HIGH = 20;
const TEMP_LOW = 19.9;

// Fan states
let fanStates = {
  fan1: false, // Initially, fan 1 is off
  fan2: false, // Initially, fan 2 is off
};

// Function to check temperature and adjust fan state accordingly
export function checkTemperatureAndAdjustFan(temperature) {
  // Turn on fan 1 if temperature is above the upper threshold
  if (temperature >= TEMP_HIGH && !fanStates.fan1) {
    turnFanOn(1);
  }
  // Turn off fan 1 if temperature is below the lower threshold
  else if (temperature <= TEMP_LOW && fanStates.fan1) {
    turnFanOff(1);
  }
}

// Function to update fan status manually
export function updateFanStatus(fanId, fanStatusId) {
  // Fetch the button element
  const button = document.getElementById(fanId);

  // Add click event listener
  button.addEventListener("click", async () => {
    // Send a POST request to the fan API to change its state
    const res = await fetch(`/api/fan/${fanId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        state: document.getElementById(fanStatusId).innerText === "Off",
      }),
    });

    const data = await res.json();

    // Update the status text and color of the fan in the UI
    document.getElementById(fanStatusId).innerText = data.state ? "On" : "Off";
    document.getElementById(`${fanId}Circle`).style.backgroundColor = data.state
      ? "green"
      : "grey";
  });
}

// Function to turn a fan on
export async function turnFanOn(fanNumber) {
  // Send a POST request to the fan API to turn it on
  const response = await fetch(`/api/fan/${fanNumber}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ state: true }),
  });

  const json = await response.json();

  // Update fan state in UI and local state if successful
  if (json.state) {
    updateFanUIState(fanNumber, true);
    fanStates[`fan${fanNumber}`] = true;
  }
}

// Function to start a cycle of turning fan 2 on and off
export function startFan2Timer() {
  console.log("Turning on Fan 2");
  turnFanOn(2);

  setTimeout(() => {
    console.log("Turning off Fan 2");
    turnFanOff(2);

    setTimeout(() => {
      startFan2Timer();
    }, FAN_2_OFF_TIME);
  }, FAN_2_ON_TIME);
}

// Function to turn a fan off
export async function turnFanOff(fanNumber) {
  // Send a POST request to the fan API to turn it off
  const response = await fetch(`/api/fan/${fanNumber}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ state: false }),
  });

  const json = await response.json();

  // Update fan state in UI and local state if successful
  if (!json.state) {
    updateFanUIState(fanNumber, false);
    fanStates[`fan${fanNumber}`] = false;
  }
}

// Function to update the fan state in the UI
function updateFanUIState(fanNumber, state) {
  const fanStatus = document.getElementById(`fan${fanNumber}Status`);
  const fanCircle = document.getElementById(`fan${fanNumber}Circle`);

  fanStatus.textContent = state ? "On" : "Off";
  fanCircle.style.backgroundColor = state ? "green" : "grey";
}
