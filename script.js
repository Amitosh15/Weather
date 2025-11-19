import config from "./config.js";

const cityInput = document.getElementById("city-input");
const searchBtn = document.getElementById("search-btn");
const currentWeather = document.querySelector(".weather-details");
const fiveDaysForecastCard = document.querySelector(".day-forecast");
const locationBtn = document.getElementById("location-btn");
const apiKey = config.WEATHER_API_KEY;

const maxRecentSearches = 5;
const recentSearches = JSON.parse(
  localStorage.getItem("recentSearches") || "[]"
);
const recentSearchesDropdown = document.getElementById("recent-searches");

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
        <div class="current-weather p-4 flex flex-col gap-6">
          <p class="text-2xl font-bold text-center text-gray-700">Current weather</p>
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
          <div class="weather-highlights flex justify-center gap-12">
            <div class="humidity text-center">
                <p class="mb-2">Humidity</p>
                <h2 id="humidityVal">___%</h2>
              </div>
              <div class="wind text-center">
                <p class="mb-2">Wind Speed</p>
                <h2 id="windVal">___m/s</h2>
              </div>
              <div class="visibility text-center">
                <p class="mb-2">Visibility</p>
                <h2 id="visibilityVal">___km</h2>
              </div>
          </div>
        </div>
      `;
      // Change background according to weather
      let weatherMain = data.weather[0].main;
      let weatherBg = weatherMain.toLowerCase();

      // Haze
      // Smoke
      // Mist
      // Scattered clouds
      // document.body.style.backgroundImage = "url('/assets/clear-sky-sun.jpg')";

      if (weatherBg.includes("clear")) {
        // document.body.backgroundImage = "";
        document.body.style.backgroundImage = "url('/assets/clear-sky.jpg')";
        document.body.style.backgroundSize = "cover";
        document.body.style.backgroundPosition = "bottom";
      } else if (weatherBg.includes("cloud")) {
        document.body.backgroundImage = "";
        document.body.style.backgroundColor = "url('/assets/cloud.jpg')";
      } else if (weatherBg.includes("rain")) {
        document.body.backgroundImage = "";
        document.body.style.backgroundColor = "url('/assets/rainy-sky.jpg')";
      } else if (weatherBg.includes("snow")) {
        document.body.backgroundImage = "";
        document.body.style.backgroundColor = "lightgray";
      } else if (weatherBg.includes("thunderstorm")) {
        document.body.backgroundImage = "";
        document.body.style.backgroundColor = "url('/assets/storm.jpg')";
      } else {
        console.log("Err");
      }

      const humidityE1 = document.getElementById("humidityVal");
      if (humidityE1 && data.main && data.main.humidity !== undefined) {
        humidityE1.innerHTML = `<i class="fa-solid fa-droplet"></i> ${data.main.humidity} %`;
      }

      const windE1 = document.getElementById("windVal");
      if (windE1 && data.wind && data.wind.speed !== undefined) {
        windE1.innerHTML = `<i class="fa-solid fa-wind"></i> ${data.wind.speed} m/s`;
      }

      const visibilityE1 = document.getElementById("visibilityVal");
      if (visibilityE1 && data.visibility !== undefined) {
        visibilityE1.innerHTML = `<i class="fa-solid fa-eye"></i> ${(
          data.visibility / 1000
        ).toFixed(2)} km`;
      }
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
        let windSpeed =
          fiveDaysForecast[i].wind && fiveDaysForecast[i].wind.speed != null
            ? fiveDaysForecast[i].wind.speed
            : null;

        fiveDaysForecastCard.innerHTML += `
        <div class="forecast-card p-4 m-2 rounded-lg shadow-md text-center inline-block min-w-max ">
          <div class="flex flex-col gap-2">
            <p class="text-sm text-white font-semibold mb-2">${
              days[date.getDay()]
            }</p>
            <p class="text-xs text-white mb-2"><i class="fa-solid fa-calendar"></i>${date.getDate()} ${
          months[date.getMonth()]
        }</p>
            <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${description}" class="mx-auto w-16 h-16 mb-2">
            <p class="font-bold text-lg text-white">${temp}&deg;C</p>
            <p class="text-xs text-white capitalize">${description}</p>
            <p class="text-xs text-white"><i class="fa-solid fa-wind"></i> ${
              windSpeed !== null ? windSpeed + " m/s" : "N/A"
            }</p>
          </div>
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

  if (!cityName) return showCustomAlert("Please enter city name", "error");

  const geocodingUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${apiKey}`;

  fetch(geocodingUrl)
    .then((res) => res.json())
    .then((data) => {
      if (data.length === 0) {
        return showCustomAlert(`No result found for "${cityName}"`);
      }
      let { lat, lon, name, country, state } = data[0];

      if (!recentSearches.includes(cityName)) {
        recentSearches.unshift(cityName);
        if (recentSearches.length > maxRecentSearches) {
          recentSearches.pop();
        }
        localStorage.setItem("recentSearches", JSON.stringify(recentSearches));
        updateRecentSearches();
      }

      getWeather(lat, lon, name, country, state);
    })
    .catch((error) => {
      console.error("Error fetching location:", error);
      showCustomAlert("Unable to find city. Please try again.", "error");
    });
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

  locationBtn.disabled = true;

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
        locationBtn.innerHTML =
          '<i class="fa-solid fa-location-crosshairs"></i> Current Location';
      }
    },
    (err) => {
      locationBtn.disable = false;
      locationBtn.innerHTML =
        '<i class="fa-solid fa-location-crosshairs"></i> Current Location';

      if (err.code === err.PERMISSION_DENIED) {
        showCustomAlert("Location permision denied.");
      } else {
        showCustomAlert("Unable to retrive your location.", "error");
      }
    },
    { enableHighAccuracy: true, timeout: 10000 }
  );
}

locationBtn.addEventListener("click", getLocation);

function updateRecentSearches() {
  if (recentSearches.length === 0) {
    recentSearchesDropdown.classList.add("hidden");
    return;
  }

  recentSearchesDropdown.innerHTML = recentSearches
    .map(
      (city) =>
        `<div class="recent-item hover:bg-gray-500 py-2 px-3 cursor-pointer" data-city="${city}">${city}</div>`
    )
    .join("");

  document.querySelectorAll(".recent-item").forEach((item) => {
    item.addEventListener("click", () => {
      const city = item.getAttribute("data-city");
      handleRecentSearch(city);
    });
  });

  recentSearchesDropdown.classList.remove("hidden");
}

// Handle clicking a recent search
function handleRecentSearch(cityName) {
  cityInput.value = cityName;
  getCity();
  recentSearchesDropdown.classList.add("hidden");
}

// Show dropdown only when clicking the input box
cityInput.addEventListener("click", () => {
  if (recentSearches.length > 0) {
    updateRecentSearches();
    recentSearchesDropdown.classList.remove("hidden");
  }
});

// Hide dropdown when clicking outside
document.addEventListener("click", (e) => {
  if (
    !cityInput.contains(e.target) &&
    !recentSearchesDropdown.contains(e.target)
  ) {
    recentSearchesDropdown.classList.add("hidden");
  }
});

// Custom Alert
function showCustomAlert(message, type = "info") {
  const alertHTML = `
  <div id="custom-alert-modal" class="fixed inset-0 flex items-center justify-center z-50">
      <div class="alert-details bg-white rounded-lg shadow-lg p-6 w-85">
        <div class="flex items-center gap-3 mb-4">
          ${
            type === "error"
              ? '<i class="fa-solid fa-circle-xmark text-red-500 text-2xl"></i>'
              : type === "success"
              ? '<i class="fa-solid fa-circle-check text-green-500 text-2xl"></i>'
              : '<i class="fa-solid fa-circle-info text-blue-500 text-2xl"></i>'
          }
          <h2 class="text-xl font-bold text-gray-800">${
            type === "error" ? "Error" : type === "success" ? "Success" : "Info"
          }</h2>
        </div>
        <p class="text-gray-600 mb-6">${message}</p>
        <button id="alert-close-btn" class="w-[80px] bg-red-500 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition">
          OK
        </button>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", alertHTML);

  const closeBtn = document.getElementById("alert-close-btn");
  const modal = document.getElementById("custom-alert-modal");

  closeBtn.addEventListener("click", () => {
    modal.remove();
  });
}
