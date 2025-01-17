function createListWithModal(data) {
  const ul = document.getElementById("dynamic-list");

  // Clear existing list items
  ul.innerHTML = "";

  data.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item.name;
    li.dataset.id = item.id;
    li.classList.add("clickable-item");
    li.style.cursor = "pointer";

    // Add click event listener
    li.addEventListener("click", async () => {
      const modal = document.getElementById("shared-modal");
      const modalTitle = document.getElementById("modal-title");
      const modalContent = document.getElementById("modal-content");

      // Show a loading state
      modalTitle.textContent = "Loading...";
      modalContent.innerHTML = "<p>Fetching chart data, please wait...</p>";

      openModal(modal);

      try {
        // Fetch detailed data for the clicked item
        const response = await fetch(`/api/item-details?id=${item.id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch item details");
        }

        const details = await response.json();

        // Update modal title
        modalTitle.textContent = details.title || "Chart Details";

        // Clear modal content and create a canvas for the chart
        modalContent.innerHTML =
          '<canvas id="chartCanvas" width="400" height="400"></canvas>';

        // Prepare data for Chart.js
        const labels = details.data.map((entry) => entry.date); // Dates for x-axis
        const timeStrings = details.data.map((entry) => entry.time); // Times as strings

        // Convert times to minutes for calculations
        const timeInMinutes = timeStrings.map((time) => {
          const [hours, minutes] = time.split(":").map(Number);
          return hours * 60 + minutes;
        });

        // Render the chart
        renderLineChart("chartCanvas", labels, timeInMinutes);
      } catch (error) {
        modalTitle.textContent = "Error";
        modalContent.innerHTML = "<p>Failed to load chart data.</p>";
        console.error("Error fetching chart data:", error);
      }
    });

    ul.appendChild(li);
  });
}

// Function to render line chart using Chart.js
function renderLineChart(canvasId, labels, data) {
  const ctx = document.getElementById(canvasId).getContext("2d");
  new Chart(ctx, {
    type: "line",
    data: {
      labels: labels, // Dates as labels on the x-axis
      datasets: [
        {
          label: "Time",
          data: data, // Time in minutes for calculations
          borderColor: "rgba(75, 192, 192, 1)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          tension: 0.4, // Smooth the curve
        },
      ],
    },
    options: {
      scales: {
        y: {
          title: {
            display: true,
            text: "Time (HH:MM)",
          },
          ticks: {
            callback: function (value) {
              // Convert minutes back to HH:MM format for y-axis ticks
              const hours = Math.floor(value / 60);
              const minutes = value % 60;
              return `${hours.toString().padStart(2, "0")}:${minutes
                .toString()
                .padStart(2, "0")}`;
            },
          },
        },
        x: {
          title: {
            display: true,
            text: "Date",
          },
        },
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: function (context) {
              // Convert minutes back to HH:MM format for tooltips
              const minutes = context.raw;
              const hours = Math.floor(minutes / 60);
              const mins = minutes % 60;
              return `Time: ${hours.toString().padStart(2, "0")}:${mins
                .toString()
                .padStart(2, "0")}`;
            },
          },
        },
      },
    },
  });
}

// Function to open modal
function openModal(modal) {
  modal.classList.add("is-active");
}

// Function to close modal
function closeModal(modal) {
  modal.classList.remove("is-active");
}

// Modal close setup
document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("shared-modal");
  document
    .querySelector(".modal-background")
    .addEventListener("click", () => closeModal(modal));
  document
    .querySelector(".modal-close")
    .addEventListener("click", () => closeModal(modal));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeModal(modal);
    }
  });

  // Example data for testing
  const exampleData = [
    { id: 1, name: "Item 1" },
    { id: 2, name: "Item 2" },
    { id: 3, name: "Item 3" },
  ];

  createListWithModal(exampleData);
});
