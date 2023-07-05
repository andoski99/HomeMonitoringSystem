// Array of sensor names
const sensorNames = ["MT_Temp", "GT_Temp", "OT_Temp", "FT_Temp"];

// Mapping of sensor names to corresponding sensor IDs
const sensorIdMap = {
  MT_Temp: "redFluidMainTent",
  GT_Temp: "redFluidGrow",
  OT_Temp: "redFluid",
  FT_Temp: "redFluidFruiting",
};

// Executes when the window is loaded
window.onload = function () {
  // Create and append thermometer for OT sensor
  const thermometerOT = createThermometer("OT_Temp", "redFluid", "OT");
  document.getElementById("thermometerOT").appendChild(thermometerOT);

  // Create and append thermometer for MT sensor
  const thermometerMT = createThermometer("MT_Temp", "redFluidMainTent", "MT");
  document.getElementById("thermometerMT").appendChild(thermometerMT);

  // Create and append thermometer for GT sensor
  const thermometerGT = createThermometer("GT_Temp", "redFluidGrow", "GT");
  document.getElementById("thermometerGT").appendChild(thermometerGT);

  // Create and append thermometer for FT sensor
  const thermometerFT = createThermometer("FT_Temp", "redFluidFruiting", "FT");
  document.getElementById("thermometerFT").appendChild(thermometerFT);

  // Update the temperatures for all sensors
  sensorNames.forEach(updateTemperature);

  // Fetch the initial humidity immediately when the page loads
  fetchHumidity();

  // Humidity Stuff
  // Create and append humidity gauge for FT sensor
  const humidityGaugeFT = createHumidityGauge(
    "FT_Humidity",
    "fruitingHumidity",
    "FT"
  );
  document.getElementById("humidityGaugeFT").appendChild(humidityGaugeFT);
  }
