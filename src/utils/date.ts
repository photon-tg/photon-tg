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

export function daysSinceDate(input: string): number {
	// Get the current time in the user's local timezone
	const now = new Date();
	const inputDate = new Date(input);
	// Get the current date in the user's local timezone (ignoring time)

	const localCurrentDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());

	// Convert the UTC input date to the local date in the user's timezone (ignoring time)
	const localInputDate = new Date(inputDate.getFullYear(), inputDate.getMonth(), inputDate.getDate());

	// Calculate the difference in time (milliseconds)
	const diffInMillis = localCurrentDate.getTime() - localInputDate.getTime();

	// Convert milliseconds to full calendar days
	const diffInDays = diffInMillis / (1000 * 60 * 60 * 24);

	// Return the number of full calendar days that have passed
	return Math.floor(diffInDays);
}

export function hoursSinceDateUTC(inputDate: Date): number {
	// Get the current UTC time in milliseconds
	const now = new Date();
	const currentUTCTime = Date.UTC(
		now.getUTCFullYear(),
		now.getUTCMonth(),
		now.getUTCDate(),
		now.getUTCHours(),
		now.getUTCMinutes(),
		now.getUTCSeconds(),
	);

	// Get the input date's UTC time in milliseconds
	const inputUTCTime = Date.UTC(
		inputDate.getUTCFullYear(),
		inputDate.getUTCMonth(),
		inputDate.getUTCDate(),
		inputDate.getUTCHours(),
		inputDate.getUTCMinutes(),
		inputDate.getUTCSeconds(),
	);

	// Calculate the difference in milliseconds and convert to hours
	const diffInMillis = currentUTCTime - inputUTCTime;
	const diffInHours = diffInMillis / (1000 * 60 * 60);

	// Round down the result to the nearest whole number of hours
	return Math.floor(diffInHours);
}

export function formatDate(date: Date) {
	// Use Intl.DateTimeFormat to format the date
	const formatter = new Intl.DateTimeFormat('en-GB', {
		day: '2-digit',
		month: '2-digit',
		year: '2-digit',
	});

	// Format the date to 'dd.mm.yy'
	const formattedDate = formatter.format(date).replace(/\//g, '.');

	return formattedDate;
}

export function isNextDay(input: string): boolean {
	// Get the current date
	const now = new Date();

	const inputDate = new Date(input);

	// Check if the current date is exactly one day after the input date (ignoring time)
	const inputDay = inputDate.getUTCDate();
	const inputMonth = inputDate.getUTCMonth();
	const inputYear = inputDate.getUTCFullYear();

	const currentDay = now.getUTCDate();
	const currentMonth = now.getUTCMonth();
	const currentYear = now.getUTCFullYear();

	// If the year and month are the same, check if it's the next day
	if (inputYear === currentYear && inputMonth === currentMonth) {
		return currentDay === inputDay + 1;
	}

	return false;
}

export function hoursSinceDate(inputDate: string | Date, decimalPlaces: number = 2): number {
	const pastDate = new Date(inputDate);
	const currentDate = new Date();

	// Get the difference in milliseconds
	const timeDifferenceMs = currentDate.getTime() - pastDate.getTime();

	// Convert milliseconds to hours
	const hoursDifference = timeDifferenceMs / (60 * 60 * 1000);

	// Round to the specified number of decimal places
	const roundedHours = parseFloat(hoursDifference.toFixed(decimalPlaces));

	return roundedHours;
}

