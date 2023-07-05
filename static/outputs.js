// This is for outputs like fans and humidifiers and heaters etc.


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
  
  /// For the FT Ventilation button
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
