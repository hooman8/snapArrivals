import Chart from "chart.js/auto";
import "chartjs-adapter-date-fns";

document.addEventListener("DOMContentLoaded", function () {
  const ctx = document.getElementById("timelineChart").getContext("2d");

  // Data with associated keys
  const timestamps = [
    { key: "Event A", time: "2025-02-10 06:45" },
    { key: "Event B", time: "2025-02-10 18:30" },
    { key: "Event C", time: "2025-02-11 08:15" },
    { key: "Event D", time: "2025-02-11 20:45" },
    { key: "Event E", time: "2025-02-12 10:00" },
    { key: "Event F", time: "2025-02-12 23:10" },
    { key: "Event G", time: "2025-02-13 14:55" },
    { key: "Event H", time: "2025-02-13 21:20" },
    { key: "Event I", time: "2025-02-14 00:29" },
    { key: "Event J", time: "2025-02-14 19:31" },
    { key: "Event K", time: "2025-02-15 07:40" },
    { key: "Event L", time: "2025-02-15 19:32" },
    { key: "Event M", time: "2025-02-16 05:50" },
    { key: "Event N", time: "2025-02-16 22:15" },
    { key: "Event O", time: "2025-02-17 13:20" },
    { key: "Event P", time: "2025-02-17 23:45" },
    { key: "Event Q", time: "2025-02-18 09:30" },
    { key: "Event R", time: "2025-02-18 18:55" },
  ];

  // Convert timestamps into chart data format
  const eventData = timestamps.map((entry) => ({
    x: new Date(entry.time),
    y: (() => {
      const dateObj = new Date(entry.time);
      return dateObj.getHours() * 60 + dateObj.getMinutes();
    })(),
    key: entry.key, // Store key for tooltip use
  }));

  new Chart(ctx, {
    type: "scatter",
    data: {
      datasets: [
        {
          label: "Arrival Times",
          data: eventData,
          borderColor: "rgba(75, 192, 192, 1)",
          backgroundColor: "rgba(75, 192, 192, 0.5)",
          pointRadius: 8, // Larger points for visibility
          pointHoverRadius: 10, // Increase hover effect size
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        x: {
          type: "time",
          time: {
            unit: "day", // Ensure full days are displayed
            displayFormats: { day: "MMM d" }, // Format X-axis labels
            tooltipFormat: "MMM d, HH:mm", // Format tooltips to show full date + time
          },
          ticks: {
            autoSkip: false, // Ensure all labels are shown
            source: "data", // Show labels only for available data points
            maxRotation: 45, // Rotates x-axis labels for readability
            minRotation: 45,
          },
          title: {
            display: true,
            text: "Date",
          },
        },
        y: {
          title: {
            display: true,
            text: "Arrival Time (HH:MM)",
          },
          ticks: {
            stepSize: 60, // Display every hour
            callback: function (value) {
              const hours = Math.floor(value / 60);
              const minutes = value % 60;
              return `${hours.toString().padStart(2, "0")}:${minutes
                .toString()
                .padStart(2, "0")}`;
            },
          },
          grid: {
            color: "rgba(200, 200, 200, 0.5)", // Light gray grid lines
            borderDash: [5, 5], // Dotted grid lines
          },
        },
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: function (context) {
              const event = eventData[context.dataIndex];
              const date = new Date(event.x).toLocaleDateString(undefined, {
                weekday: "short",
                month: "short",
                day: "numeric",
                year: "numeric",
              });
              const time = new Date(event.x).toLocaleTimeString(undefined, {
                hour: "2-digit",
                minute: "2-digit",
              });

              return `${event.key} - ${date} at ${time}`;
            },
          },
        },
      },
    },
  });
});
