import { FullTaskFragment, UserTaskFragment } from '@/gql/graphql';

export interface RewardByDay {
	day: number;
	reward: number;
}

export type TaskType = 'daily_reward';

export type FullTask = FullTaskFragment & {
	rewardByDay?: RewardByDay[];
};

export type PersonalizedTask = FullTask & {
	userTask?: UserTaskFragment;
};
