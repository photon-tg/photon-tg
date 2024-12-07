import {
	BattlePhotoFragment,
	CoreUserFieldsFragment,
	UserPhotoFragment,
	UserTaskFragment,
} from '@/gql/graphql';
import { Friend } from '@/app/api/friends/route';

export interface UserCredentials {
	email: string;
	password: string;
}

export interface SignUpData {
	first_name: string;
	last_name?: string;
	telegram_id: string;
	is_premium?: boolean;
	username?: string;
	consent_version: string;
}

export enum UserErrorType {
	INVALID_DATA_CHECK_STRING = 'INVALID_DATA_CHECK_STRING',
	SERVER_ERROR = 'SERVER_ERROR',
}

export interface UserStateMeta {
	isInitialized: boolean;
	referrerId: string | null;
	error: null | UserErrorType;
	isConsentGiven: boolean;
	isNewUser: boolean;
}

export interface UninitializedUserState {
	data: {
		telegramUser: null;
		user: null;
		photos: {
			meta: {
				isUploading: boolean;
			};
			data: null;
		};
		tasks: null;
		friends: null;
		isDailyRewardClaimed: boolean;
		isDailyPhotoCompleted: boolean;
		passiveIncome: null;
	};
	meta: UserStateMeta;
}

export interface RegisteredUserState {
	data: {
		telegramUser: WebAppUser;
		user: CoreUserFieldsFragment;
		photos: {
			meta: {
				isUploading: boolean;
			};
			oldData: UserPhotoFragment[];
			data: BattlePhotoFragment[];
		};
		tasks: UserTaskFragment[];
		friends: Friend[];
		isDailyRewardClaimed: boolean;
		isDailyPhotoCompleted: boolean;
		passiveIncome: number;
	};
	meta: UserStateMeta;
}

export interface ReferralData {
	coins: number;
	first_name: string;
	last_name: string;
	is_premium: boolean;
	telegram_id: string;
	is_claimed_by_referrer: boolean;
}
