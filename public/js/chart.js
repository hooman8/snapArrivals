// Labels: Dates
const labels = ["2025-01-01", "2025-01-02", "2025-01-03"];

// Data: Times
const timeStrings = ["19:32", "19:31", "19:32"];

// Convert times to total minutes past midnight for internal representation
const timeInMinutes = timeStrings.map((time) => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
});

// Chart configuration
const config = {
  type: "line",
  data: {
    labels: labels, // Dates as labels
    datasets: [
      {
        label: "Time",
        data: timeInMinutes, // Numerical data for internal calculations
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.4, // Optional: Smooth the curve
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
            // Round the value to the nearest integer (minutes)
            const roundedValue = Math.round(value);

            // Convert minutes to HH:MM format
            const hours = Math.floor(roundedValue / 60);
            const minutes = roundedValue % 60;

            // Format as "HH:MM"
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
            // Convert minutes back to HH:MM format for tooltip
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
};

// Render the chart
const ctx = document.getElementById("myChart").getContext("2d");
new Chart(ctx, config);
