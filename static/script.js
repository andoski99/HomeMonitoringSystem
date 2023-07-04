const sensorNames = ["MT_Temp", "GT_Temp", "OT_Temp", "FT_Temp"];
const sensorIdMap = {
  MT_Temp: "redFluidMainTent",
  GT_Temp: "redFluidGrow",
  OT_Temp: "redFluid",
  FT_Temp: "redFluidFruiting",
};

window.onload = function () {
  const thermometerOT = createThermometer("OT_Temp", "redFluid", "OT");
  document.getElementById("thermometerOT").appendChild(thermometerOT);

  const thermometerMT = createThermometer("MT_Temp", "redFluidMainTent", "MT");
  document.getElementById("thermometerMT").appendChild(thermometerMT);

  const thermometerGT = createThermometer("GT_Temp", "redFluidGrow", "GT");
  document.getElementById("thermometerGT").appendChild(thermometerGT);

  const thermometerFT = createThermometer("FT_Temp", "redFluidFruiting", "FT");
  document.getElementById("thermometerFT").appendChild(thermometerFT);

  sensorNames.forEach(updateTemperature);
};

// ... Rest of your JavaScript code ...

function updateTemperature(sensorName) {
  fetch(`/api/temperature/${sensorName}`)
    .then((response) => response.json())
    .then((data) => {
      const temperature = data[sensorName];
      document.getElementById(sensorIdMap[sensorName]).style.height =
        mapTemperatureToHeight(temperature) + "px";
    });
}

function mapTemperatureToHeight(temp) {
  const relativeTemp = temp - 10;
  const proportion = relativeTemp / 20;
  return proportion * 100;
}

// Added new code to reduce the size of the html
function createThermometer(sensorName, sensorId, sensorLabel) {
  let thermometer = document.createElement("div");
  thermometer.className = "thermometer";

  let label = document.createElement("div");
  label.innerText = sensorLabel;
  thermometer.appendChild(label);

  let glass = document.createElement("div");
  glass.className = "glass";

  let redFluid = document.createElement("div");
  redFluid.className = "red-fluid";
  redFluid.id = sensorId;

  let mercury = document.createElement("div");
  mercury.className = "mercury";

  glass.appendChild(redFluid);
  glass.appendChild(mercury);
  thermometer.appendChild(glass);

  let tempValue = document.createElement("span");
  tempValue.id = `tempValue${sensorName}`;
  thermometer.appendChild(tempValue);

  let scale = document.createElement("div");
  scale.className = "scale";

  let graduations = document.createElement("div");
  graduations.className = "graduations";

  let majorGraduation = document.createElement("div");
  majorGraduation.className = "major-graduation";

  let minorGraduation = document.createElement("div");
  minorGraduation.className = "minor-graduation";

  graduations.appendChild(majorGraduation);
  graduations.appendChild(minorGraduation);
  scale.appendChild(graduations);

  let labels = document.createElement("div");
  labels.className = "labels";

  let label1 = document.createElement("div");
  label1.className = "label";
  label1.innerHTML = "35&deg;C";

  let label2 = document.createElement("div");
  label2.className = "label";
  label2.innerHTML = "25&deg;C";

  let label3 = document.createElement("div");
  label3.className = "label";
  label3.innerHTML = "10&deg;C";

  labels.appendChild(label1);
  labels.appendChild(label2);
  labels.appendChild(label3);

  scale.appendChild(labels);
  thermometer.appendChild(scale);

  return thermometer;
}

setInterval(() => {
  sensorNames.forEach(updateTemperature);
}, 5000); // Update every minute
