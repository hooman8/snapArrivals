const { Temporal } = require("@js-temporal/polyfill");

// Array of CET timestamps
const timestamps = [
  "2025-01-15T08:45:00+01:00[Europe/Berlin]",
  "2025-01-15T08:55:00+01:00[Europe/Berlin]",
  "2025-01-15T09:05:00+01:00[Europe/Berlin]",
  "2025-01-15T08:47:00+01:00[Europe/Berlin]",
  "2025-01-15T09:15:00+01:00[Europe/Berlin]",
];

// Convert timestamps to Temporal.ZonedDateTime and extract the time part
const times = timestamps.map((ts) => {
  const zonedDateTime = Temporal.ZonedDateTime.from(ts);
  return {
    original: ts,
    time: zonedDateTime.toPlainTime(), // Extract time portion
  };
});

// Sort by time
times.sort((a, b) => Temporal.PlainTime.compare(a.time, b.time));

// Find times within 10 minutes of each other
const withinTenMinutes = [];
for (let i = 0; i < times.length - 1; i++) {
  const current = times[i].time;
  for (let j = i + 1; j < times.length; j++) {
    const next = times[j].time;
    const diff = current.until(next).total("minutes");
    if (diff <= 10) {
      withinTenMinutes.push([times[i].original, times[j].original]);
    } else {
      // Since the array is sorted, break early if the difference exceeds 10 minutes
      break;
    }
  }
}

// Output the results
console.log("Pairs of times within 10 minutes:", withinTenMinutes);
