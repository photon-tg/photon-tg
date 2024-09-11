import { FullTaskFragment } from '@/gql/graphql';
import { RewardByDay } from '@/types/Task';

export enum ApplicationErrorType {
	NETWORK_ERROR = 'NETWORK_ERROR',
}

export type Task = FullTaskFragment & {
	rewardByDay: RewardByDay[];
}

export interface ApplicationState {
	data: {
		tasks: Task[];
	}
	meta: {
		error: ApplicationErrorType | null;
		isInitialized: boolean;
	}
}
