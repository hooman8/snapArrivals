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
  const timeZone = "Europe/Paris";

  // Parse the time strings into Date objects
  const currentTimeInCET = toZonedTime(parseISO(currentTime), timeZone);
  const arrivalTimeInCET = toZonedTime(parseISO(arrivalTime), timeZone);

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

// Example Usage
const currentTime = getPresentFormattedCETTime();
const arrivalTime = getRandomMorningTimeCET();

console.log("Current Time:", currentTime);
console.log("Yesterday's Random PM Time:", getRandomPMTimePreviousDayCET());
console.log("Tomorrow's morning Random time:", arrivalTime);

console.log(isLate(currentTime, arrivalTime));
console.log(isLate(currentTime, getRandomPMTimePreviousDayCET()));
