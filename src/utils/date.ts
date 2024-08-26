export function isDateTodayUTC(date: Date | null): boolean {
  if (date === null) {
    return false;
  }

  // Get the current date in UTC
  const todayUTC = new Date();

  // Compare the UTC year, month, and day
  return (
    date.getUTCDate() === todayUTC.getUTCDate() &&
    date.getUTCMonth() === todayUTC.getUTCMonth() &&
    date.getUTCFullYear() === todayUTC.getUTCFullYear()
  );
}

function daysSinceDate(inputDate: Date): number {
  // Get the current date and the input date as UTC timestamps
  const now = new Date();
  const currentTimestamp = now.getTime(); // current time in milliseconds
  const inputTimestamp = inputDate.getTime(); // input time in milliseconds

  // Calculate the difference in milliseconds and convert it to days
  const diffInMillis = currentTimestamp - inputTimestamp;
  const diffInDays = diffInMillis / (1000 * 60 * 60 * 24);

  // Return the floor value of the difference in days
  return Math.floor(diffInDays);
}
