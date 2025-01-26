import * as tf from "@tensorflow/tfjs";

// Example timestamps in CET (Central European Time)
const timestamps = [
  "2025-01-15T08:45:00+01:00[Europe/Berlin]",
  "2025-01-15T08:55:00+01:00[Europe/Berlin]",
  "2025-01-15T09:05:00+01:00[Europe/Berlin]",
  "2025-01-15T09:15:00+01:00[Europe/Berlin]",
  "2025-01-15T09:25:00+01:00[Europe/Berlin]",
];

// Convert timestamps to minutes since the start of the day, adjusted for UTC
const convertToMinutes = (timestamp) => {
  const simplifiedTimestamp = timestamp.split("[")[0]; // Remove timezone info in brackets
  const date = new Date(simplifiedTimestamp);
  // Get hours and minutes adjusted for UTC, then account for the +01:00 offset
  const utcMinutes = date.getUTCHours() * 60 + date.getUTCMinutes();
  const offsetInMinutes = 60; // +01:00 is 60 minutes ahead of UTC
  return utcMinutes + offsetInMinutes;
};

const timesInMinutes = timestamps.map(convertToMinutes);

// Calculate intervals between consecutive times
const intervals = [];
for (let i = 1; i < timesInMinutes.length; i++) {
  intervals.push(timesInMinutes[i] - timesInMinutes[i - 1]);
}

// Target time for prediction
const mostRecentTime = timesInMinutes[timesInMinutes.length - 1];
const k = 3; // Number of neighbors

// Compute distances and sort neighbors
const distances = timesInMinutes.slice(0, -1).map((time, index) => ({
  index,
  distance: Math.abs(mostRecentTime - time), // Use absolute difference
}));

distances.sort((a, b) => a.distance - b.distance);

// Select nearest neighbors
const nearestNeighbors = distances.slice(0, k);

// Predict the interval using the average of the nearest neighbors
const predictedInterval = tf.tidy(() => {
  const neighborIndices = nearestNeighbors.map((neighbor) => neighbor.index);
  const neighborIntervals = tf.tensor1d(
    neighborIndices.map((idx) => intervals[idx])
  );
  return neighborIntervals.mean().arraySync(); // Average interval
});

// Ensure the interval is rounded to avoid unsupported fractional values
const roundedInterval = Math.round(predictedInterval);

// Predict the next arrival time
const nextArrival = mostRecentTime + roundedInterval;

// Convert nextArrival back to hours and minutes
const nextArrivalHours = Math.floor(nextArrival / 60);
const nextArrivalMinutes = nextArrival % 60;

console.log(
  `Most Recent Time: ${Math.floor(mostRecentTime / 60)}:${mostRecentTime % 60}`
);
console.log(`Predicted Interval: ${roundedInterval} minutes`);
console.log(`Next Arrival Time: ${nextArrivalHours}:${nextArrivalMinutes}`);
