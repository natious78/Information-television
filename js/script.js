document.addEventListener("DOMContentLoaded", function () {
  // moving text bar
  const API_URL = "https://corsproxy.io/https://c.ganjoor.net/beyt-json.php";
  const textbarBox = document.getElementById("textbarBox");
  const maxRequests = 200; // Total texts to fetch
  let requestCount = 0;
  let fetchInterval; // Will hold the interval for fetching texts
  let scrollInterval; // Will hold the scroll timer

  // Function to fetch one JSON text from the API
  async function fetchText() {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      // Build the text using m1, m2, and poet properties
      return `${data.m1}//////${data.m2}//////${data.poet}`;
    } catch (error) {
      console.error("Error fetching text:", error);
      return "Error fetching text";
    }
  }

  // Function to add one text to the text bar
  async function addText() {
    const text = await fetchText();
    const span = document.createElement("span");
    span.className = "moving-text";
    span.textContent = text;
    textbarBox.appendChild(span);
    requestCount++;
    if (requestCount >= maxRequests) {
      clearInterval(fetchInterval);
    }
  }

  // Function to start fetching texts sequentially with a 10-second delay between each
  function startFetching() {
    // Clear the container and reset counter
    textbarBox.innerHTML = "";
    requestCount = 0;
    // Immediately fetch and add the first text
    addText();
    // Then every 10 seconds, add another text until 200 have been added
    fetchInterval = setInterval(addText, 10000);
  }

  // Function to start a continuous scroll effect by incrementing scrollLeft (reversed direction)
  function startScrolling() {
    // Clear any existing scroll interval first (if restarting)
    if (scrollInterval) clearInterval(scrollInterval);
    scrollInterval = setInterval(() => {
      // Increment scrollLeft to reverse the scroll direction in RTL container
      textbarBox.scrollLeft += 1; // Adjust for faster/slower scrolling
      // If we've scrolled to the end, reset scrollLeft to 0
      if (
        textbarBox.scrollLeft >=
        textbarBox.scrollWidth - textbarBox.clientWidth
      ) {
        textbarBox.scrollLeft = 0;
      }
    }, 20); // Adjust the interval time for a smoother effect
  }

  // Function to (re)start the whole process: fetching texts and scrolling
  function startProcess() {
    startFetching();
    startScrolling();
  }

  // Start the process when the page loads
  startProcess();

  // Every two hours (7200000 ms), clear and restart the fetching process
  setInterval(() => {
    // Clear the current fetch interval and restart fetching texts
    clearInterval(fetchInterval);
    startFetching();
  }, 7200000);

  //   weather Api
  const weatherTemperature = document.getElementById("weather-temperature");
  const weatherIcon = document.querySelector(".navbar__weather i");
  const latitude = 29.5926;
  const longitude = 52.5836;
  const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=weather_code&current=temperature_2m&daily=uv_index_max&timezone=auto`;

  function updateWeather() {
    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        const temperature = data.current.temperature_2m;
        const weatherCode = data.hourly.weather_code[0]; // Get the first hourly weather code

        weatherTemperature.textContent = Math.round(temperature);
        updateWeatherIcon(weatherCode);
      })
      .catch((error) => {
        console.error(
          "There has been a problem with your fetch operation:",
          error
        );
        weatherTemperature.textContent = "N/A";
      });
  }

  function updateWeatherIcon(weatherCode) {
    // Open-Meteo weather codes to Font Awesome icons mapping
    if (weatherCode >= 200 && weatherCode < 300) {
      // Thunderstorm
      weatherIcon.className = "fas fa-bolt fa-1x";
    } else if (weatherCode >= 300 && weatherCode < 400) {
      // Drizzle
      weatherIcon.className = "fas fa-cloud-rain fa-1x";
    } else if (weatherCode >= 500 && weatherCode < 600) {
      // Rain
      weatherIcon.className = "fas fa-cloud-showers-heavy fa-1x";
    } else if (weatherCode >= 600 && weatherCode < 700) {
      // Snow
      weatherIcon.className = "fas fa-snowflake fa-1x";
    } else if (weatherCode >= 700 && weatherCode < 800) {
      // Atmosphere (mist, fog, etc.)
      weatherIcon.className = "fas fa-smog fa-1x";
    } else if (weatherCode === 0) {
      // Clear sky
      weatherIcon.className = "fas fa-sun fa-1x";
    } else if (weatherCode >= 1 && weatherCode <= 3) {
      // Mostly clear
      weatherIcon.className = "fas fa-cloud-sun fa-1x";
    } else if (weatherCode >= 45 && weatherCode <= 48) {
      // Fog
      weatherIcon.className = "fas fa-smog fa-1x";
    } else if (weatherCode >= 51 && weatherCode <= 55) {
      // Drizzle
      weatherIcon.className = "fas fa-cloud-rain fa-1x";
    } else if (weatherCode >= 56 && weatherCode <= 57) {
      // Freezing drizzle
      weatherIcon.className = "fas fa-snowflake fa-1x";
    } else if (weatherCode >= 61 && weatherCode <= 65) {
      // Rain
      weatherIcon.className = "fas fa-cloud-showers-heavy fa-1x";
    } else if (weatherCode >= 66 && weatherCode <= 67) {
      // Freezing rain
      weatherIcon.className = "fas fa-snowflake fa-1x";
    } else if (weatherCode >= 71 && weatherCode <= 77) {
      // Snow fall
      weatherIcon.className = "fas fa-snowflake fa-1x";
    } else if (weatherCode >= 80 && weatherCode <= 82) {
      // Rain showers
      weatherIcon.className = "fas fa-cloud-showers-heavy fa-1x";
    } else if (weatherCode === 85 || weatherCode === 86) {
      // Snow showers
      weatherIcon.className = "fas fa-snowflake fa-1x";
    } else if (weatherCode >= 95 && weatherCode <= 99) {
      // Thunderstorm
      weatherIcon.className = "fas fa-bolt fa-1x";
    } else {
      weatherIcon.className = "fas fa-cloud fa-1x"; // Default cloud icon
    }
  }

  updateWeather();
  setInterval(updateWeather, 600000);

  // update date
  function updateDateTime() {
    const miladiDateElement = document.getElementById("miladi-date");
    const now = new Date();
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    miladiDateElement.textContent = now.toLocaleDateString(undefined, options);

    const solarDateElement = document.getElementById("solar-date");
    solarDateElement.textContent = now.toLocaleDateString("fa-IR", options);
  }

  updateDateTime();
  setInterval(updateDateTime, 1000);

  //   update time
  function updateTime() {
    const timeElement = document.getElementById("current-time");
    const now = new Date();
    const timeString = now.toLocaleTimeString(); 
    timeElement.textContent = timeString;
  }
  updateTime();
  setInterval(updateTime, 1000);
});
