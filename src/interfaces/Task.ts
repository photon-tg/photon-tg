import { FullTaskFragment, FullUserTaskFragment } from '@/gql/graphql';

export interface RewardByDay {
  day: number;
  reward: number;
}

export type TaskType = 'daily_reward';

export type FullTask = FullTaskFragment & {
	rewardByDay?: RewardByDay[];
}

export type PersonalizedTask = FullTask & {
	userTask?: FullUserTaskFragment;
};
