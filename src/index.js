const apiKey = "f0aaa5691cfa79897f985t035b4a46fo";

// === Formatters ===
function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[date.getDay()];
}

function formatDateTime(date) {
  let dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = dayNames[date.getDay()];
  let hours = date.getHours().toString().padStart(2, "0");
  let minutes = date.getMinutes().toString().padStart(2, "0");
  return `${day} ${hours}:${minutes}`;
}

function formatTime(timestamp) {
  const date = new Date(timestamp * 1000);
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  return `${hours}:${minutes} ${ampm}`;
}

// === API Calls ===
function searchCity(city) {
  let currentUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=metric`;
  axios
    .get(currentUrl)
    .then(displayWeather)
    .catch((error) => console.error("Current weather error:", error));
}

function getForecast(city) {
  let forecastUrl = `https://api.shecodes.io/weather/v1/forecast?query=${city}&key=${apiKey}&units=metric`;
  console.log(forecastUrl);
  axios
    .get(forecastUrl)
    .then((response) => displayForecast(response))
    .catch((error) => console.error("Forecast error:", error));
}

// === Display Functions ===
function displayWeather(response) {
  let data = response.data;

  document.querySelector("#city").textContent = data.city;
  document.querySelector("#description").textContent =
    data.condition.description.toUpperCase();
  document.querySelector(
    "#humidity"
  ).textContent = `${data.temperature.humidity}%`;
  document.querySelector("#wind-speed").textContent = `${Math.round(
    data.wind.speed
  )} km/h`;
  document.querySelector("#temperature").textContent = Math.round(data.temperature.current);
  document.querySelector("#time").textContent = formatDateTime(
    new Date(data.time * 1000)
  );
  document.querySelector(
    "#icon"
  ).innerHTML = `<img src="${data.condition.icon_url}" class="weather-app-icon"/>`;

  getForecast(response.data.city);

  let weatherContainer = document.querySelector(".weather-app-data");
  if (weatherContainer) {
    weatherContainer.classList.remove("fade");
    void weatherContainer.offsetWidth;
    weatherContainer.classList.add("fade");
  }
}

function applyTimeBasedBackground() {
  const now = new Date();
  const hour = now.getHours();
  const body = document.body;

  body.classList.remove("morning", "daytime", "evening", "night"); // clear previous

  if (hour >= 5 && hour < 11) {
    body.classList.add("morning");
  } else if (hour >= 11 && hour < 17) {
    body.classList.add("daytime");
  } else if (hour >= 17 && hour < 20) {
    body.classList.add("evening");
  } else {
    body.classList.add("night");
  }
}

// Run on load
applyTimeBasedBackground();


function displayForecast(response) {
  let forecast = response.data.daily;
  let forecastHTML = "";

  forecast.slice(1, 6).forEach((day) => {
    forecastHTML += `
      <div class="daily-forecast">
        <div class="forecast-weekday">${formatDay(day.time)}</div>
        <div class="forecast-icon">
          <img src="${day.condition.icon_url}" alt="${
      day.condition.description
    }" />
        </div>
        <div class="daily-temperatures">
  <span class="daily-temperature"><strong>${Math.round(
    day.temperature.maximum
  )}</strong></span>
  <span class="daily-temperature">${Math.round(day.temperature.minimum)}</span>
</div>
</div>`;
  });

  document.querySelector(".weather-forecast").innerHTML = forecastHTML;
}

// === Event Listener ===
document
  .querySelector("#search-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    let city = document.querySelector("#search-form-input").value;
    searchCity(city);
  });

// Load default city
searchCity("Perth");
// }
