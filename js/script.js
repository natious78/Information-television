document.addEventListener("DOMContentLoaded", function () {
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
});
