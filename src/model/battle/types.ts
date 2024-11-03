import { BattleFragment, BattlePhotoFragment } from '@/gql/graphql';

export type Top = {
	// place: number;
	like_count: number;
	username?: string;
	first_name: string;
};

export type UserPhoto = BattlePhotoFragment & { likes_count: number };

export type SelectedBattle = {
	id: string;
	userPhoto?: UserPhoto;
	top: Top[];
};

export interface BattleState {
	data: {
		battles: BattleFragment[];
		currentBattleId: string | null;
		currentBattlePhotos: BattlePhotoFragment[];
		selectedBattle: SelectedBattle | null;
		canJoin: boolean;
		hasJoined: boolean;
		timeLeftToJoin: number | null;
		timeLeftToVote?: {
			formattedHours: string;
			formattedMinutes: string;
		};
		message: {
			isShown: boolean;
			content?: {
				title: string;
				description: string;
			};
		};
	};
	meta: {
		error: null;
		isInitialized: boolean;
		isAnimating: boolean;
	};
}
