// Imports from other functions

import {
  updateGH_temp,
  updateTemperature,
  setGH_tempRedFluid,
  connectGH_temp,
  setTemperatureRedFluid,
  createThermometerHtml,
} from "./tempFunctions.js";

import {
  updateFanStatus,
  turnFanOn,
  startFan2Timer,
  turnFanOff,
} from "./fanFunctions.js";



// Constants
const TEMP_HIGH = 20;
const TEMP_LOW = 19.9;

// Keep track of each fan's state
let fan1State = false; // Initially, fan 1 is off
let fan2State = false; // Initially, fan 2 is off

function createTentHtml(name, id) {
  console.log(`Creating tent for ${name} with id ${id}`);
  return `
    <div class="tent inner-tent">
        ${name}
        ${createThermometerHtml(id)}
    </div>`;
}

async function getDeviceInfo() {
  const response = await fetch(`/api/device-info/${0}`);
  const deviceInfo = await response.json();

  let deviceInfoString = "";
  for (const property in deviceInfo) {
    deviceInfoString += `${property}: ${deviceInfo[property]}<br>`;
  }
  document.getElementById("deviceInfo").innerHTML = deviceInfoString;

  updateTemperature();
}
updateFanStatus("turnOnFan1", "fan1Status");
updateFanStatus("turnOnFan2", "fan2Status");

window.onload = function () {
  getDeviceInfo(0);
  startFan2Timer();
  connectGH_temp();
  setInterval(updateTemperature, 5000);
};
