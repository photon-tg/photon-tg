import { Image } from './Image';

export interface RewardByDays {
  day: number;
  reward: number;
}

export interface Task {
  id: string;
  name: string;
  description: string;
  image: Image;
  reward_coins?: number;
  rewards_by_day?: RewardByDays[];
}
