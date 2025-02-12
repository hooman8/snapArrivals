const ctx = document.getElementById("timelineChart").getContext("2d");

// Define events with timestamps
const events = [
  { time: new Date().setHours(8, 0), label: "Event 1" },
  { time: new Date().setHours(12, 30), label: "Event 2" },
  { time: new Date().setHours(18, 45), label: "Event 3" },
  { time: new Date().setDate(new Date().getDate() + 1), label: "Event 4" }, // Tomorrow
  { time: new Date().setDate(new Date().getDate() + 1), label: "Event 5" }, // Tomorrow
];

// Extract event labels and times
const eventLabels = events.map((event) => event.label);
const eventTimes = events.map((event) => event.time);

// Define chart
new Chart(ctx, {
  type: "scatter",
  data: {
    datasets: [
      {
        label: "Events Timeline",
        data: eventTimes.map((time, index) => ({ x: time, y: index })),
        backgroundColor: "blue",
        pointRadius: 6,
      },
    ],
  },
  options: {
    responsive: true,
    scales: {
      x: {
        type: "time",
        time: {
          unit: "hour",
          tooltipFormat: "MMM d, h:mm a",
        },
        title: {
          display: true,
          text: "Time",
        },
        ticks: {
          autoSkip: false,
        },
      },
      y: {
        type: "category",
        labels: eventLabels, // Use event names as labels
        title: {
          display: true,
          text: "Events",
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => {
            const event = events[context.dataIndex];
            const eventDate = new Date(event.time).toLocaleDateString(
              undefined,
              {
                weekday: "short",
                month: "short",
                day: "numeric",
                year: "numeric",
              }
            );
            const eventTime = new Date(event.time).toLocaleTimeString(
              undefined,
              {
                hour: "2-digit",
                minute: "2-digit",
              }
            );
            return `${event.label} - ${eventDate} at ${eventTime}`;
          },
        },
      },
    },
  },
});
