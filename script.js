import config from "./config.js";

let cityInput = document.getElementById("city-input");
let searchBtn = document.getElementById("search-btn");
let currentWeather = document.querySelector(".weather-details");
let fiveDaysForecastCard = document.querySelector(".day-forecast");
const apiKey = config.WEATHER_API_KEY;

function getWeather(lat, lon) {
  let weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;
  let forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  fetch(weatherUrl)
    .then((res) => res.json())
    .then((data) => {
      // get current date
      const currentDate = new Date().toLocaleDateString("en-US", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });

      currentWeather.innerHTML = `
        <div class="current-weather p-4">
            <div class="weather-icon flex flex-col items-center mb-4">
              <p>Current weather</p>
              <img src="https://openweathermap.org/img/wn/${
                data.weather[0].icon
              }@2x.png" alt="${data.weather[0].description}">
            </div>
            <div class="details text-center">
                <h2 class="text-4xl font-bold text-gray-800 mb-2">${(
                  data.main.temp - 273.15
                ).toFixed(2)}&deg;C</h2>
                <p class="text-gray-600 capitalize">${
                  data.weather[0].description
                }</p>
            </div>
        </div>
        <div class="date">
          <p class="flex items-center gap-2 text-gray-600 mb-2"><i class="fa-solid fa-calendar"></i>${currentDate}</p>
          <p class="flex items-center gap-2 text-gray-600"><i class="fa-solid fa-location-crosshairs"></i>${
            data.name
          }, ${data.sys.country}</p>
        </div>
      `;
    });
}

function getCity() {
  let cityName = cityInput.value.trim();

  if (!cityName) return alert("Please enter city name");

  const geocodingUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${apiKey}`;

  fetch(geocodingUrl)
    .then((res) => res.json())
    .then((data) => {
      if (data.length === 0) {
        return alert(`No result found for "${cityName}"`);
      }
      const { lat, lon } = data[0];
      getWeather(lat, lon);
    })
    .catch((error) => console.error("Error fetching location:", error));
}

searchBtn.addEventListener("click", getCity);
cityInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") getCity();
});
