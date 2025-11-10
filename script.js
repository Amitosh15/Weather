let cityInput = document.getElementById("city-input");
let searchBtn = document.getElementById("search-btn");
let currentWeather = document.querySelector(".weather-details");
const apiKey = "a4603a498866d294add98032a2603d08";

function getWeather(lat, lon) {
  let weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;
}
