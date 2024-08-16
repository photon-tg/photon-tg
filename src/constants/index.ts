export type Level = 1 | 2 | 3 | 4 | 5;

export const levelToCoins = new Map<Level, number>([
  [1, 25000],
  [2, 100000],
  [3, 500000],
  [4, 2500000],
  [5, 10000000],
]);
export const levelToCoinsPerTap = new Map<Level, number>([
  [1, 1],
  [2, 2],
  [3, 3],
  [4, 4],
  [5, 5],
]);
export const levelToMaxEnergy = new Map<Level, number>([
  [1, 1000],
  [2, 1500],
  [3, 2000],
  [4, 2500],
  [5, 3000],
]);
export const levelToBasePassiveIncome = new Map<Level, number>([
  [1, 50],
  [2, 100],
  [3, 200],
  [4, 400],
  [5, 800],
]);

export function getUserLevel(userCoins: number): Level {
  for (const [level, coins] of levelToCoins) {
    if (userCoins < coins) {
      return level;
    }
  }

  return 1;
}

export function getUserProgressProcentage(userCoins: number): number {
  const level = getUserLevel(userCoins);
  return userCoins === 0
    ? 0
    : Math.round((100 * userCoins) / (levelToCoins.get(level) as number));
}

export function getUserPassiveIncome(level: Level): number {
  return levelToBasePassiveIncome.get(level) as number;
}
