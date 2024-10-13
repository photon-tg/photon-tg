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
	// Convert both dates to UTC midnight by using setUTCHours(0, 0, 0, 0)
	let startDate = new Date(input);
	let endDate = new Date(new Date().toUTCString());

	// Set time to midnight (UTC) for both dates
	startDate.setUTCHours(0, 0, 0, 0);
	endDate.setUTCHours(0, 0, 0, 0);

	// Calculate the difference in milliseconds
	let diffInMs = endDate.getTime() - startDate.getTime();

	// Convert milliseconds to full days
	let diffInDays = diffInMs / (1000 * 60 * 60 * 24);

	// Return the absolute value of the difference in days
	return Math.abs(diffInDays);
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

export function hoursSinceDate(
	inputDate: string | Date,
	decimalPlaces: number = 2,
): number {
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

export interface CalculateEnergyGainedResponse {
	newEnergy: number;
	energyGained: number;
}
export function calculateEnergyGained(
	lastSyncDateUTC: string,
	currentEnergy: number,
): CalculateEnergyGainedResponse {
	// Get current UTC time
	const currentDateUTC = new Date();

	// Convert last sync date string to Date object
	const lastSyncDate = new Date(lastSyncDateUTC);

	// Calculate the time difference in seconds
	const timeDifferenceInSeconds = Math.floor(
		(currentDateUTC.getTime() - lastSyncDate.getTime()) / 1000,
	);

	// Assuming 1 energy per second
	const energyGained = timeDifferenceInSeconds * 3;

	// Add the gained energy to the user's current energy
	const newEnergy = currentEnergy + energyGained;

	return {
		newEnergy,
		energyGained,
	};
}

export function getNow() {
	return new Date().toUTCString();
}

interface TimeSubtraction {
	days?: number;
	hours?: number;
	minutes?: number;
	seconds?: number;
}

export function subtractTime(
	date: Date | string,
	{ days = 0, hours = 0, minutes = 0, seconds = 0 }: TimeSubtraction = {},
): string {
	const newDate = new Date(date); // Clone the passed date to avoid mutating it

	// Subtract days, hours, minutes, and seconds
	newDate.setUTCDate(newDate.getUTCDate() - days);
	newDate.setUTCHours(newDate.getUTCHours() - hours);
	newDate.setUTCMinutes(newDate.getUTCMinutes() - minutes);
	newDate.setUTCSeconds(newDate.getUTCSeconds() - seconds);

	return newDate.toUTCString();
}

export function isToday(dateStr: string | null | undefined): boolean {
	if (!dateStr) {
		return false;
	}

	const date = new Date(dateStr); // Parse the input date
	const now = new Date(); // Get the current date

	// Get today's start and end time in UTC
	const todayStart = Date.UTC(
		now.getUTCFullYear(),
		now.getUTCMonth(),
		now.getUTCDate(),
		0,
		0,
		0,
	);
	const todayEnd = Date.UTC(
		now.getUTCFullYear(),
		now.getUTCMonth(),
		now.getUTCDate(),
		23,
		59,
		59,
	);

	// Get the input date's UTC time
	const inputDate = Date.UTC(
		date.getUTCFullYear(),
		date.getUTCMonth(),
		date.getUTCDate(),
	);

	// Check if the input date is within today
	return inputDate >= todayStart && inputDate <= todayEnd;
}

export function minutesSinceUTCDate(pastDate: string): number {
	const nowUTC = new Date(new Date().toISOString()); // Get the current time in UTC
	const diffInMilliseconds = nowUTC.getTime() - new Date(pastDate).getTime();
	const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60));
	return diffInMinutes;
}
