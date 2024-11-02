export type Level = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export const levelToCoins = new Map<Level, number>([
	[1, 25000],
	[2, 100000],
	[3, 500000],
	[4, 2500000],
	[5, 10000000],
	[6, 50000000],
	[7, 100000000],
	[8, 1000000000],
	[9, 40000000000],
	[10, Infinity],
]);
export const levelToCoinsPerTap = new Map<Level, number>([
	[1, 1],
	[2, 2],
	[3, 3],
	[4, 4],
	[5, 5],
	[6, 6],
	[7, 7],
	[8, 8],
	[9, 9],
	[10, 10],
]);
export const levelToMaxEnergy = new Map<Level, number>([
	[1, 1000],
	[2, 1500],
	[3, 2000],
	[4, 2500],
	[5, 3000],
	[6, 3500],
	[7, 4000],
	[8, 4500],
	[9, 5000],
	[10, 5500],
]);

export const levelToPhotoReward = new Map<Level, number>([
	[1, 5000],
	[2, 10000],
	[3, 20000],
	[4, 40000],
	[5, 80000],
	[6, 160000],
	[7, 320000],
	[8, 640000],
	[9, 1280000],
	[10, 2560000],
]);

export const levelToPhotoPassiveIncome = new Map<Level, number>([
	[1, 50],
	[2, 100],
	[3, 200],
	[4, 400],
	[5, 800],
	[6, 1600],
	[7, 3200],
	[8, 6400],
	[9, 12800],
	[10, 25600],
]);

export const levelToSelectReward = new Map<Level, number>([
	[1, 5],
	[2, 20],
	[3, 45],
	[4, 80],
	[5, 125],
	[6, 180],
	[7, 245],
	[8, 320],
	[9, 405],
	[10, 1000],
]);

export const levelToSelectEnergyReduction = new Map<Level, number>([
	[1, 50],
	[2, 75],
	[3, 100],
	[4, 125],
	[5, 150],
	[6, 175],
	[7, 200],
	[8, 225],
	[9, 250],
	[10, 275],
]);

export const levelToReceiveLikeReward = new Map<Level, number>([
	[1, 10],
	[2, 40],
	[3, 90],
	[4, 160],
	[5, 250],
	[6, 360],
	[7, 490],
	[8, 640],
	[9, 810],
	[10, 1000],
]);

export const USER_REF_BONUS = 5000;
export const PREMIUM_USER_REF_BONUS = 20000;

export function getUserLevel(userCoins: number): Level {
	for (const [level, coins] of levelToCoins) {
		if (userCoins < coins) {
			return level;
		}
	}

	return 1;
}

export function getUserLevelProgress(userCoins: number): number {
	const level = getUserLevel(userCoins);
	const prevLvlMoney =
		(level > 1 && levelToCoins.get((level - 1) as Level)) || 0;
	return userCoins === 0
		? 0
		: Math.round(
				(100 * (userCoins - prevLvlMoney)) /
					(levelToCoins.get(level) as number),
			);
}
