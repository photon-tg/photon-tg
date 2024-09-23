import { FullTaskFragment } from '@/gql/graphql';
import { RewardByDay } from '@/types/Task';
import { Level } from '@/constants';

export enum ApplicationErrorType {
	NETWORK_ERROR = 'NETWORK_ERROR',
}

export type RewardByLevel = Record<
	Level,
	{
		coins: number;
		passive: number;
	}
>;

export interface TextByDate {
	date: string;
	name: string;
	description: string;
}

export type Task = FullTaskFragment & {
	rewardByDay?: RewardByDay[];
	rewardByLevel?: RewardByLevel;
	textByDate?: TextByDate[];
};

export interface ApplicationState {
	data: {
		tasks: Task[];
	};
	meta: {
		error: ApplicationErrorType | null;
		isInitialized: boolean;
	};
}
