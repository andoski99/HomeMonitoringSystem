// This file is responsible for creating and manipulating HTML related to thermometer and temperature display
// Import the eventDispatcher
import { eventDispatcher } from "./EventDispatcher.js";

// Listen to temperature change events
eventDispatcher.addListener("temperatureChanged", setTemperatureRedFluid);
eventDispatcher.addListener("temperatureChanged", setGH_tempRedFluid);

// Function to create thermometer html
export function createThermometerHtml(tentName, fluidId) {
  // This function takes the tent name and fluid Id and returns a thermometer HTML string
  // ...
}

// Function to set the height of the red fluid in the thermometer based on the temperature
export function setTemperatureRedFluid(temperature) {
  // This function takes the temperature and adjusts the height of the red fluid in the thermometer
  // This function is also now a listener for temperatureChanged events
  // ...
}

// Function to set the height of the red fluid in the GH_temp thermometer based on the temperature
export function setGH_tempRedFluid(temperature) {
  // This function takes the temperature of GH_temp and adjusts the height of the red fluid in the thermometer
  // This function is also now a listener for temperatureChanged events
  // ...
}
