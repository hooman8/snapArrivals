import { format, toZonedTime } from "date-fns-tz";
import { parseISO } from "date-fns";

function getRandomPMTimePreviousDayCET() {
  // Current date
  const now = new Date();

  // Get the previous day
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);

  // Generate a random time in the PM (12:00 PM to 11:59 PM CET)
  const randomHour = Math.floor(Math.random() * 12) + 12; // Random hour between 12 and 23
  const randomMinute = Math.floor(Math.random() * 60); // Random minute between 0 and 59
  const randomSecond = Math.floor(Math.random() * 60); // Random second between 0 and 59

  // Set the random time in UTC
  yesterday.setUTCHours(randomHour - 1, randomMinute, randomSecond, 0); // Subtract 1 for CET offset

  // Convert UTC to CET
  const timeZone = "Europe/Paris";
  const timeInCET = toZonedTime(yesterday, timeZone);

  // Format the CET time
  const formattedTime = format(timeInCET, "yyyy-MM-dd HH:mm:ssXXX", {
    timeZone,
  });

  return formattedTime;
}

function isLate(currentTime, arrivalTime) {
  // Helper function to parse time strings and convert to a Date in CET
  function parseToCET(timeString) {
    const [hours, minutes, seconds] = timeString.split(":").map(Number);
    const now = new Date();

    // Create a new Date object and set the time components
    const cetDate = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      hours,
      minutes,
      seconds || 0
    );

    // Adjust the time to CET offset (UTC+1)
    cetDate.setHours(cetDate.getHours() - cetDate.getTimezoneOffset() / 60 + 1);

    return cetDate;
  }

  // Convert both times to CET Date objects
  const currentTimeInCET = parseToCET(currentTime);
  const arrivalTimeInCET = parseToCET(arrivalTime);

  // Compare the times
  if (currentTimeInCET > arrivalTimeInCET) {
    return "You are late!";
  } else {
    return "You are on time!";
  }
}

// Reuse your existing functions
function getRandomMorningTimeCET() {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);

  const randomHour = Math.floor(Math.random() * 6) + 6;
  const randomMinute = Math.floor(Math.random() * 60);
  const randomSecond = Math.floor(Math.random() * 60);

  tomorrow.setUTCHours(randomHour - 1, randomMinute, randomSecond, 0);

  const timeZone = "Europe/Paris";
  const timeInCET = toZonedTime(tomorrow, timeZone);

  const formattedTime = format(timeInCET, "yyyy-MM-dd HH:mm:ssXXX", {
    timeZone,
  });

  return formattedTime;
}

function getPresentFormattedCETTime() {
  const now = new Date();
  const timeZone = "Europe/Paris"; // CET timezone
  const timeInCET = toZonedTime(now, timeZone);

  const formattedTime = format(timeInCET, "yyyy-MM-dd HH:mm:ssXXX", {
    timeZone,
  });

  return formattedTime;
}

function adjustDateBasedOnTime(timeString) {
  // Parse the time components, including milliseconds if present
  const [timePart, msPart] = timeString.split(".");
  const [hours, minutes, seconds] = timePart.split(":").map(Number);
  const milliseconds = msPart ? parseInt(msPart, 10) : 0;

  // Get the current date
  const now = new Date();

  // Create a new Date object in UTC
  const adjustedDate = new Date(
    Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())
  );

  // Adjust for AM or PM
  if (hours < 12) {
    // AM: Move to tomorrow
    adjustedDate.setUTCDate(adjustedDate.getUTCDate() + 1);
  }

  // Apply the time components directly in UTC
  adjustedDate.setUTCHours(hours, minutes, seconds || 0, milliseconds);

  // Format the final date with a fixed CET offset (+1)
  const formattedDate = adjustedDate
    .toISOString()
    .replace("T", " ")
    .replace("Z", "+01:00");
  return formattedDate;
}

// Example Usage
console.log(adjustDateBasedOnTime("19:43:57.128")); // Should correctly return today's date in CET with the supplied time
console.log(adjustDateBasedOnTime("08:43:57.128")); // Should correctly return tomorrow's date in CET with the supplied time
// Example Usage
const currentTime = getPresentFormattedCETTime();
const arrivalTime = getRandomMorningTimeCET();

console.log("Current Time:", currentTime);
console.log("Yesterday's Random PM Time:", getRandomPMTimePreviousDayCET());
console.log("Tomorrow's morning Random time:", arrivalTime);

console.log(isLate(currentTime, arrivalTime));
console.log(isLate(currentTime, getRandomPMTimePreviousDayCET()));
