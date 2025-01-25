document.addEventListener("DOMContentLoaded", () => {
  const reportLinks = document.querySelectorAll(".report a");
  const activities = document.querySelectorAll(".activity");
  const jsonFilePath = "data.json"; 

  function setDefaultView() {
    activities.forEach((activity) => {
      const hours = activity.querySelector(".hours");
      const hoursSmall = activity.querySelector(".hours-small");
      const timeDescription = activity.querySelector("h4");

      hours.textContent = "--";
      timeDescription.firstChild.textContent = "--.";
      hoursSmall.textContent = "--";
    });
  }

  setDefaultView();

  async function fetchData() {
    try {
      const response = await fetch(jsonFilePath);
      if (!response.ok) {
        throw new Error(`Failed to load JSON: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching JSON data:", error);
    }
  }

  reportLinks.forEach((link) => {
    link.addEventListener("click", async (e) => {
      e.preventDefault();

      const timeType = link.dataset.type;

      const data = await fetchData();

      if (data) {
        activities.forEach((activity) => {
          const title = activity.querySelector(".title h3").textContent;
          const hours = activity.querySelector(".hours");
          const hoursSmall = activity.querySelector(".hours-small");
          const timeDescription = activity.querySelector("h4");

          const item = data.find((entry) => entry.title === title);

          if (item) {
            const timeframe = item.timeframes[timeType];
            hours.textContent = `${timeframe.current}hrs`;
            const timeText =
              timeType === "daily"
                ? "Yesterday"
                : timeType === "weekly"
                ? "Last Week"
                : "Last Month";
            timeDescription.firstChild.textContent = `${timeText} - `;
            hoursSmall.textContent = `${timeframe.previous}hrs`;
          }
        });
      }
    });
  });
});

