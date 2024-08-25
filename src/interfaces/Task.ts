import { Image } from './Image';

export interface RewardByDays {
  day: number;
  reward: number;
}

export type TaskType = 'daily_reward';

export interface Task {
  id: string;
  name: string;
  description: string;
  image: Image;
  reward_coins?: number;
  reward_by_day?: RewardByDays[];
  type: TaskType;

  userTaskId: string;
  isCompleted?: boolean;
  daysCompleted?: number;
  isRewardByDayClaimedToday?: boolean;
}
