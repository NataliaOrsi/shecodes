function formatDate(timestamp) {
  let date = new Date(timestamp);
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[date.getDay()];
  return `${day} ${hours}:${minutes}`;
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  return days[day];
}

function formatDayOfTheMonth(timestamp) {
  let date = new Date(timestamp * 1000);
  let month = date.getMonth();
  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let day = date.getDate();
  let lastDigit = day % 10;
  let suffix = null;
  if (lastDigit === 1) {
    suffix = `st`;
  } else if (lastDigit === 2) {
    suffix = `nd`;
  } else if (lastDigit === 3) {
    suffix = "rd";
  } else {
    suffix = `st`;
  }

  return `${months[month]}, ${day}${suffix}`;
}

function displayImages(icon) {
  let url = null;
  if (icon === "04d" || icon === "04n") {
    url = `https://s3.amazonaws.com/shecodesio-production/uploads/files/000/015/394/original/broken-clouds-128.png?1629183967`;
  } else if (icon === "01d" || icon === "01n") {
    url = `https://s3.amazonaws.com/shecodesio-production/uploads/files/000/015/396/original/clear-sky-128.png?1629184041`;
  } else if (icon === "02d" || icon === "02n") {
    url = `https://s3.amazonaws.com/shecodesio-production/uploads/files/000/015/397/original/few-clouds-128.png?1629184904`;
  } else if (icon === "50d") {
    url = `https://s3.amazonaws.com/shecodesio-production/uploads/files/000/015/398/original/mist-128.png?1629189082`;
  } else if (icon === "10d") {
    url = `https://s3.amazonaws.com/shecodesio-production/uploads/files/000/015/399/original/rain-128.png?1629189140`;
  } else if (icon === "03d" || icon === "03n") {
    url = `https://s3.amazonaws.com/shecodesio-production/uploads/files/000/015/400/original/scattered-clouds-128.png?1629189571`;
  } else if (icon === "09d") {
    url = `https://s3.amazonaws.com/shecodesio-production/uploads/files/000/015/401/original/shower-rain-128.png?1629189616`;
  } else if (icon === "13d") {
    url = `https://s3.amazonaws.com/shecodesio-production/uploads/files/000/015/402/original/snow-128.png?1629189672`;
  } else if (icon === "11d") {
    url = `https://s3.amazonaws.com/shecodesio-production/uploads/files/000/015/403/original/thunderstorm-128.png?1629189797`;
  } else {
    url = `http://openweathermap.org/img/wn/${icon}@2x.png`;
  }

  return url;
}

function displayForecast(response) {
  console.log(response);
  let forecast = response.data.daily;

  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `<div class="row">`;

  forecast.forEach(function (forecastDay, index) {
    if (index < 5) {
      forecastHTML =
        forecastHTML +
        `
            <div class="col">
              <div class="forcast-week-day">${formatDay(forecastDay.dt)}</div>
              <div class="forecast-week-date">${formatDayOfTheMonth(
                forecastDay.dt
              )}</div>
              <img 
                src=${displayImages(forecastDay.weather[0].icon)}
                alt=""
                width="60"
                class="weather-icons"
              />
              <div class="forecast-week-temperatures">
                <span class="week-max-temperature" id="max-temperature">${Math.round(
                  forecastDay.temp.max
                )}° </span>
                <span class="week-min-temperature" id="min-temperature">${Math.round(
                  forecastDay.temp.min
                )}° </span>
              </div>
            </div>
          `;
    }
  });
  forecast = forecastHTML + `<div>`;
  forecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  console.log(coordinates);
  let apiKey = "3b2c6af1778711e6c3af06800ecbd9b8";
  let unit = "metric";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=${unit}`;
  console.log(apiUrl);
  axios.get(apiUrl).then(displayForecast);
}

function displayTemperature(response) {
  let temperatureElement = document.querySelector("#temperature");
  let cityElement = document.querySelector("#city");
  let descriptionElement = document.querySelector("#description");
  let humidityElement = document.querySelector("#humidity");
  let windElement = document.querySelector("#wind");
  let iconElement = document.querySelector("#icon");
  let dateElement = document.querySelector("#main-date");
  celsiusTemperature = response.data.main.temp;

  temperatureElement.innerHTML = Math.round(celsiusTemperature);
  cityElement.innerHTML = response.data.name;
  descriptionElement.innerHTML = response.data.weather[0].description;
  humidityElement.innerHTML = response.data.main.humidity;
  windElement.innerHTML = Math.round(response.data.wind.speed);
  dateElement.innerHTML = formatDate(response.data.dt * 1000);
  iconElement.setAttribute(
    "src",
    `${displayImages(response.data.weather[0].icon)}`
  );
  iconElement.setAttribute("alt", response.data.weather[0].description);

  getForecast(response.data.coord);
}

function search(city) {
  let apiKey = "3b2c6af1778711e6c3af06800ecbd9b8";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayTemperature);
}

function handleSubmit(event) {
  event.preventDefault();
  let cityInputElement = document.querySelector("#city-input");
  search(cityInputElement.value);
}

function displayFahrenheitTemperature(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#temperature");
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
  let fahrenheitTemperature = (celsiusTemperature * 9) / 5 + 32;
  temperatureElement.innerHTML = Math.round(fahrenheitTemperature);
}

function displayCelsiusTemperature(event) {
  event.preventDefault();
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
  let temperatureElement = document.querySelector("#temperature");
  temperatureElement.innerHTML = Math.round(celsiusTemperature);
}

let celsiusTemperature = null;

let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", handleSubmit);

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", displayFahrenheitTemperature);

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", displayCelsiusTemperature);

search("New York");
