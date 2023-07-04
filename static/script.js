const sensorNames = ["MT_Temp", "GT_Temp", "OT_Temp", "FT_Temp"];
const sensorIdMap = {
  MT_Temp: "redFluidMainTent",
  GT_Temp: "redFluidGrow",
  OT_Temp: "redFluid",
  FT_Temp: "redFluidFruiting",
};

window.onload = function () {
  sensorNames.forEach(updateTemperature);
};

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

setInterval(() => {
  sensorNames.forEach(updateTemperature);
}, 60000); // Update every minute
