import config from "./config.js";

const cityInput = document.getElementById("city-input");
const searchBtn = document.getElementById("search-btn");
const currentWeather = document.querySelector(".weather-details");
const fiveDaysForecastCard = document.querySelector(".day-forecast");
const locationBtn = document.getElementById("location-btn");
const apiKey = config.WEATHER_API_KEY;

function getWeather(lat, lon, name, country) {
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
          <p class="text-2xl font-bold text-center mb-6 text-gray-600">Current weather</p>
          <div class="weather-data flex gap-8">
            <div class="weather-icon flex flex-col items-center mb-4">
            <img src="https://openweathermap.org/img/wn/${
              data.weather[0].icon
            }@2x.png" alt="${data.weather[0].description}">
            <p class="text-gray-600 font-xl capitalize">${
              data.weather[0].description
            }</p>
          </div>
          <div class="details text-center flex flex-col justify-center">
            <h2 class="text-4xl font-bold text-gray-800 mb-2">${(
              data.main.temp - 273.15
            ).toFixed(2)}&deg;C</h2>
                
          </div>
          <div class="date flex flex-col justify-center">
            <p class="flex items-center gap-2 text-gray-600 mb-2"><i class="fa-solid fa-calendar"></i>${currentDate}</p>
            <p class="flex items-center gap-2 text-gray-600"><i class="fa-solid fa-location-crosshairs"></i>${
              data.name
            }, ${data.sys.country}</p>
          </div>
          </div>
        </div>
      `;
    });

  fetch(forecastUrl)
    .then((res) => res.json())
    .then((data) => {
      let forecastDays = [];
      let fiveDaysForecast = data.list.filter((forecast) => {
        let forecastDate = new Date(forecast.dt_txt).getDate();

        if (!forecastDays.includes(forecastDate)) {
          forecastDays.push(forecastDate);
          return true;
        }
        return false;
      });

      fiveDaysForecastCard.innerHTML = ``;

      for (let i = 0; i < fiveDaysForecast.length && i < 5; i++) {
        let date = new Date(fiveDaysForecast[i].dt_txt);
        let temp = (fiveDaysForecast[i].main.temp - 273.15).toFixed(2);
        let icon = fiveDaysForecast[i].weather[0].icon;
        let description = fiveDaysForecast[i].weather[0].description;

        fiveDaysForecastCard.innerHTML += `
        <div class="forecast-card p-4 m-2 rounded-lg shadow-md bg-white text-center inline-block min-w-max">
            <p class="text-sm text-gray-600 font-semibold mb-2">${
              days[date.getDay()]
            }</p>
            <p class="text-xs text-gray-500 mb-2">${date.getDate()} ${
          months[date.getMonth()]
        }</p>
            <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${description}" class="mx-auto w-16 h-16 mb-2">
            <p class="font-bold text-lg text-gray-800">${temp}&deg;C</p>
            <p class="text-xs text-gray-600 capitalize">${description}</p>
        </div>
        `;
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

// Getting city cordinates
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
      const { lat, lon, name, country, state } = data[0];
      getWeather(lat, lon, name, country, state);
    })
    .catch((error) => console.error("Error fetching location:", error));
}

// Eventlistener
searchBtn.addEventListener("click", getCity);
cityInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") getCity();
});

async function getLocation() {
  if (!navigator.geolocation) {
    alert("Geolocation is not support by your browser.");
  }

  locationBtn.disable = true;
  // locationBtn.innerHTML =
  //   '<i class="fa-solid fa-spinner fa-spin"></i> Locating...';

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      try {
        const revUrl = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${apiKey}`;
        const res = await fetch(revUrl);
        const data = await res.json();
        let name = "Current Location";
        let country, state;

        if (Array.isArray(data) && data.length > 0) {
          name = data[0].name || name;
          country = data[0].country;
          state = data[0].state;
        }

        getWeather(lat, lon, name, country, state);
      } catch (error) {
        getWeather("Current Location", lat, lon);
      } finally {
        locationBtn.disable = false;
        location.innerHTML =
          '<i class="fa-solid fa-location-crosshairs"></i> Current Location';
      }
    },
    (err) => {
      locationBtn.disable = false;
      location.innerHTML =
        '<i class="fa-solid fa-location-crosshairs"></i> Current Location';

      if (err.code === err.PERMISSION_DENIED) {
        alert("Location permision denied.");
      } else {
        alert("Unable to retrive your location.");
      }
    },
    { enableHighAccuracy: true, timeout: 10000 }
  );
}

locationBtn.addEventListener("click", getLocation);
