const { Temporal } = require("@js-temporal/polyfill");

// Example timestamps in CET
const timestamps = [
  "2025-01-15T08:45:00+01:00[Europe/Berlin]",
  "2025-01-15T08:55:00+01:00[Europe/Berlin]",
  "2025-01-15T09:05:00+01:00[Europe/Berlin]",
  "2025-01-15T09:15:00+01:00[Europe/Berlin]",
  "2025-01-15T09:25:00+01:00[Europe/Berlin]",
];

// Convert timestamps to Temporal.PlainTime
const times = timestamps.map((ts) =>
  Temporal.ZonedDateTime.from(ts).toPlainTime()
);

// Calculate intervals between consecutive times
const intervals = [];
for (let i = 1; i < times.length; i++) {
  const diff = times[i - 1].until(times[i]).total("minutes");
  intervals.push(diff);
}

// Target time for prediction
const mostRecentTime = times[times.length - 1];
const k = 3; // Number of neighbors

// Compute distances and sort neighbors
const distances = times.slice(0, -1).map((time, index) => ({
  index,
  distance: Math.abs(mostRecentTime.until(time).total("minutes")), // Use absolute difference
}));

distances.sort((a, b) => a.distance - b.distance);

// Select nearest neighbors
const nearestNeighbors = distances.slice(0, k);

// Predict the interval using the average of the nearest neighbors
const predictedInterval =
  nearestNeighbors.reduce((sum, neighbor) => {
    const idx = neighbor.index;
    return idx >= 0 ? sum + intervals[idx] : sum;
  }, 0) / k;

// Ensure the interval is rounded to avoid unsupported fractional values
const roundedInterval = Math.round(predictedInterval);

// Predict the next arrival time
const nextArrival = mostRecentTime.add({ minutes: roundedInterval });

console.log(`Most Recent Time: ${mostRecentTime.toString()}`);
console.log(`Predicted Interval: ${roundedInterval} minutes`);
console.log(`Next Arrival Time: ${nextArrival.toString()}`);
