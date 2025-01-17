const { Temporal } = require("@js-temporal/polyfill");

// Example timestamps
const timestamps = [
  "2025-01-15T08:45:00+01:00[Europe/Berlin]",
  "2025-01-15T08:55:00+01:00[Europe/Berlin]",
  "2025-01-15T09:05:00+01:00[Europe/Berlin]",
  "2025-01-15T09:15:00+01:00[Europe/Berlin]",
  "2025-01-15T09:25:00+01:00[Europe/Berlin]",
];

// Step 1: Extract intervals (in minutes) between arrivals
const intervals = [];
const times = timestamps.map((ts) =>
  Temporal.ZonedDateTime.from(ts).toPlainTime()
);
for (let i = 1; i < times.length; i++) {
  intervals.push(times[i - 1].until(times[i]).total("minutes"));
}

// Step 2: Simulate a KNN prediction (simple average of nearest intervals)
const k = 3; // Number of neighbors
const targetTime = Temporal.PlainTime.from("09:00:00"); // Example target time

// Compute distances from target time
const distances = times.map((time) => ({
  time,
  distance: Math.abs(targetTime.until(time).total("minutes")),
}));

// Sort by distance and take the nearest k neighbors
distances.sort((a, b) => a.distance - b.distance);
const nearestNeighbors = distances.slice(0, k);

// Predict the next interval based on the average of nearest intervals
const predictedInterval =
  nearestNeighbors.reduce((sum, neighbor, index) => {
    if (index < k - 1) {
      const idx = times.indexOf(neighbor.time);
      return sum + intervals[idx];
    }
    return sum;
  }, 0) / k;

console.log(`Predicted interval: ${predictedInterval} minutes`);
