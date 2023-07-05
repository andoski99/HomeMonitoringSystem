// This is where the repetitive html is generated using functions.


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