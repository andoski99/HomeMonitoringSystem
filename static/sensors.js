// Update temperatures at regular interval
// This file contains the logic for the sensors in the tent like temperature and humidity


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


function fetchHumidity() {
    fetch('/api/humidity/FT_Humidity')
        .then(response => response.json())
        .then(data => {
            let humidityFT = document.getElementById('humidityFT');
            humidityFT.innerHTML = `Humidity: ${data['FT_Humidity']}%`;
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

// Call the function periodically to update the humidity value
setInterval(fetchHumidity, 60000); // updates every second


// Maps humidity to humidity gauge height (assuming you have a similar setup as the temperature sensors)
function mapHumidityToHeight(humidity) {
   const minHumidity = 40; 
   const maxHumidity = 100; 

   // Calculate the relative temperature within the range
   const relativeHumidity = humidity - minHumidity;

   // Calculate the temperature range
   const humidityRange = maxHumidity - minHumidity;

   // Calculate the proportion of the temperature within the range
   const proportion = relativeHumidity / humidityRange;

   // Convert the proportion to percentage
   const heightPercentage = proportion * 100; // This will be a value between 0 and 100

   // Return the height as a percentage with '%'
   return `${heightPercentage}%`;
}


// This is for the humidity sensor.
const humiditySensorNames = [
  "FT_Humidity"
];

const humiditySensorIdMap = {
 FT_Humidity: "fruitingHumidity"
};


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

setInterval(() => {
  sensorNames.forEach(updateTemperature);
}, 60000); // Update every sixty seconds
