import { Temporal } from "@js-temporal/polyfill";

// Example timestamps in CET
const timestamps = [
  "2025-01-15T08:45:00+01:00[Europe/Berlin]",
  "2025-01-15T08:55:00+01:00[Europe/Berlin]",
  "2025-01-15T09:05:00+01:00[Europe/Berlin]",
  "2025-01-15T09:15:00+01:00[Europe/Berlin]",
  "2025-01-15T09:25:00+01:00[Europe/Berlin]",
];

// Step 1: Convert timestamps to Temporal.PlainTime
const times = timestamps.map((ts) =>
  Temporal.ZonedDateTime.from(ts).toPlainTime()
);

// Step 2: Calculate intervals (in minutes) between consecutive times
const intervals = [];
for (let i = 1; i < times.length; i++) {
  const diff = times[i - 1].until(times[i]).total("minutes");
  intervals.push(diff);
}

// Step 3: Define KNN parameters
const k = 3; // Number of neighbors
const mostRecentTime = times[times.length - 1]; // Last recorded time

// Step 4: Compute distances from the most recent time
const distances = times.slice(0, -1).map((time, index) => ({
  index,
  distance: Math.abs(mostRecentTime.until(time).total("minutes")),
}));

// Step 5: Sort by distance and find the nearest neighbors
distances.sort((a, b) => a.distance - b.distance);
const nearestNeighbors = distances.slice(0, k);

// Step 6: Predict the next interval using the average of the nearest neighbors
const predictedInterval =
  nearestNeighbors.reduce((sum, neighbor) => {
    return sum + intervals[neighbor.index];
  }, 0) / k;

// Step 7: Predict the next arrival time
const nextArrival = mostRecentTime.add({ minutes: predictedInterval });

console.log(`Most Recent Time: ${mostRecentTime.toString()}`);
console.log(`Predicted Interval: ${predictedInterval.toFixed(2)} minutes`);
console.log(`Next Arrival Time: ${nextArrival.toString()}`);
