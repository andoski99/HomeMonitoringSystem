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

  /// For the GT Ventilation button
  document
    .querySelector("#turnOnGTVentilation")
    .addEventListener("click", function () {
      // get the current state of the fans
      fetch(`/api/fan/group/GTVentilation`, { method: "GET" })
        .then((response) => {
          //console.log(response); // Log the response
          return response.json();
        })
        .then((data) => {
          const fanState = data.state; // current state of the fan group

          // toggle the state
          const newState = !fanState;
          const newStateText = newState ? "On" : "Off";

          // set the new state
          fetch(`/api/fan/group/GTVentilation`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ state: newState }),
          })
            .then((response) => response.json())
            .then((data) => {
              // update the text of the button to reflect the new state
              document.querySelector("#turnOnGTVentilationStatus").textContent =
                newStateText;

              // update the class of the circle to reflect the new state
              const circle = document.querySelector("#GTVentilationCircle");
              circle.classList.remove("on", "off"); // remove both classes in case one is present
              circle.classList.add(newState ? "on" : "off"); // add the correct class
            })
            .catch((error) => {
              console.error("Error:", error);
            });
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    });
  /// For the GT Ventilation button
  document
    .querySelector("#turnOnFTVentilation")
    .addEventListener("click", function () {
      // get the current state of the fans
      fetch(`/api/fan/group/FTVentilation`, { method: "GET" })
        .then((response) => {
          //console.log(response); // Log the response
          return response.json();
        })
        .then((data) => {
          const fanState = data.state; // current state of the fan group

          // toggle the state
          const newState = !fanState;
          const newStateText = newState ? "On" : "Off";

          // set the new state
          fetch(`/api/fan/group/FTVentilation`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ state: newState }),
          })
            .then((response) => response.json())
            .then((data) => {
              // update the text of the button to reflect the new state
              document.querySelector("#turnOnFTVentilationStatus").textContent =
                newStateText;

              // update the class of the circle to reflect the new state
              const circle = document.querySelector("#FTVentilationCircle");
              circle.classList.remove("on", "off"); // remove both classes in case one is present
              circle.classList.add(newState ? "on" : "off"); // add the correct class
            })
            .catch((error) => {
              console.error("Error:", error);
            });
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    });
};

function updateFanState(fanElementID, newState) {
  const newStateText = newState ? "On" : "Off";
  if (fanElementID === "turnOnGTVentilation") {
    document.querySelector("#turnOnGTVentilationStatus").textContent =
      newStateText;
  } else if (fanElementID === "turnOnFTVentilation") {
    document.querySelector("#turnOnFTVentilationStatus").textContent =
      newStateText;
  }
  document.querySelector(`#${fanElementID}Circle`).style.backgroundColor =
    newState ? "green" : "grey";
}

// Updates the temperature for a specific sensor
function updateTemperature(sensorName) {
  // Fetch the temperature data for the sensor
  fetch(`/api/temperature/${sensorName}`)
    .then((response) =>  response.json())
    .then((data) => {
      const temperature = data[sensorName];

      // Round temperature to 1 decimal place
      const roundedTemperature = Math.round(temperature * 10) / 10;

      // Update thermometer height based on temperature
      document.getElementById(sensorIdMap[sensorName]).style.height =
        mapTemperatureToHeight(temperature); // No need to append '%'

      // Update temperature value display
      document.querySelector(`#tempValue${sensorName}`).innerText =
        roundedTemperature + " °C";
    });
}


// Maps temperature to thermometer height
function mapTemperatureToHeight(temp) {
  const minTemperature = 10; // Minimum temperature on the thermometer
  const maxTemperature = 30; // Maximum temperature on the thermometer

  // Calculate the relative temperature within the range
  const relativeTemp = temp - minTemperature;

  // Calculate the temperature range
  const temperatureRange = maxTemperature - minTemperature;

  // Calculate the proportion of the temperature within the range
  const proportion = relativeTemp / temperatureRange;

  // Convert the proportion to percentage
  const heightPercentage = proportion * 100; // This will be a value between 0 and 100

  // Return the height as a percentage with '%'
  return `${heightPercentage}%`;
}

// Creates a thermometer html element based on sensor information
/**
 * Creates a thermometer element based on sensor information.
 *
 * @param {string} sensorName - The name of the sensor.
 * @param {string} sensorId - The ID of the sensor element.
 * @param {string} sensorLabel - The label to display on the thermometer.
 * @returns {HTMLElement} The created thermometer element.
 */
function createThermometer(sensorName, sensorId, sensorLabel) {
  // Create the main thermometer container
  let thermometer = document.createElement("div");
  thermometer.className = "thermometer";

  // Create the label container
  let label = document.createElement("div");
  label.className = "thermometer-header"; // Use the class "thermometer-header" for the label

  // Create the label text element
  let labelSpan = document.createElement("span");
  labelSpan.className = "label";
  labelSpan.innerText = `${sensorLabel}: `;

  // Create the temperature value element
  let tempValue = document.createElement("span");
  tempValue.id = `tempValue${sensorName}`;
  tempValue.style.whiteSpace = "nowrap";

  // Append label text and temperature value to the label container
  label.appendChild(labelSpan);
  label.appendChild(tempValue);

  // Append the label container to the thermometer
  thermometer.appendChild(label);

  // Create the glass element
  let glass = document.createElement("div");
  glass.className = "glass";

  // Create the red fluid element representing the temperature
  let redFluid = document.createElement("div");
  redFluid.className = "red-fluid";
  redFluid.id = sensorId;
 

  // Create the mercury element
  let mercury = document.createElement("div");
  mercury.className = "mercury";

  // Append the red fluid and mercury to the glass element
  glass.appendChild(redFluid);
  glass.appendChild(mercury);

  // Append the glass element to the thermometer
  thermometer.appendChild(glass);

  // Create the scale element
  let scale = document.createElement("div");
  scale.className = "scale";

  // Create the graduations element
  let graduations = document.createElement("div");
  graduations.className = "graduations";

  // Create the major and minor graduation elements
  let majorGraduation = document.createElement("div");
  majorGraduation.className = "major-graduation";

  let minorGraduation = document.createElement("div");
  minorGraduation.className = "minor-graduation";

  // Append major and minor graduations to the graduations element
  graduations.appendChild(majorGraduation);
  graduations.appendChild(minorGraduation);

  // Append the graduations element to the scale element
  scale.appendChild(graduations);

  // Create the labels element
  let labels = document.createElement("div");
  labels.className = "labels";

  // Create temperature labels
  let label2 = document.createElement("div");
  label2.className = "label";
  label2.innerHTML = "30&deg;C";

  let label3 = document.createElement("div");
  label3.className = "label";
  label3.innerHTML = "25&deg;C";

  let label4 = document.createElement("div");
  label4.className = "label";
  label4.innerHTML = "20&deg;C";

  let label5 = document.createElement("div");
  label5.className = "label";
  label5.innerHTML = "15&deg;C";

  let label6 = document.createElement("div");
  label6.className = "label";
  label6.innerHTML = "10&deg;C";

  // Append temperature labels to the labels element
  labels.appendChild(label2);
  labels.appendChild(label3);
  labels.appendChild(label4);
  labels.appendChild(label5);
  labels.appendChild(label6);

  // Append the labels element to the scale element
  scale.appendChild(labels);

  // Append the scale element to the thermometer
  thermometer.appendChild(scale);

  // Return the created thermometer element
  return thermometer;
}

// Update temperatures at regular intervals
setInterval(() => {
  sensorNames.forEach(updateTemperature);
}, 60000); // Update every five seconds
