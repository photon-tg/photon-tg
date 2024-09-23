import { SignUpData, UserCredentials } from '@/model/user/types';
import { daysSinceDate, hoursSinceDate } from '@/utils/date';
import {
	TaskFragment,
	UserPhotoFragment,
	UserTaskFragment,
} from '@/gql/graphql';
import { Level, levelToPhotoPassiveIncome } from '@/constants';
import { RewardByDay } from '@/types/Task';
import { UserPhoto } from '@/types/photo';

export function getUserCredentials(telegramId: string): UserCredentials {
	return {
		email: `${telegramId}@photon.com`,
		password: telegramId,
	};
}

export function getSignUpData(
	telegramUser: WebAppUser,
	telegramId: string,
): SignUpData {
	return {
		first_name: telegramUser.first_name,
		last_name: telegramUser.last_name,
		is_premium: telegramUser.is_premium ?? false,
		telegram_id: telegramId,
	};
}

export function getIsDailyRewardClaimed(
	lastDailyReward: string | undefined | null,
) {
	if (!lastDailyReward) {
		return false;
	}

	return daysSinceDate(lastDailyReward) < 1;
}

export type ClaimRewardHelperRT = {
	lastDailyReward?: string;
	completedDays: number;
	isCompleted: boolean;
	rewardCoins: number;
};

export function claimTaskHelper(
	type: 'daily_reward',
	task: TaskFragment,
	userTask?: UserTaskFragment,
): ClaimRewardHelperRT | undefined {
	switch (type) {
		case 'daily_reward': {
			const previousCompletedDays = userTask?.days_completed || 0;
			const completedDays = previousCompletedDays + 1;
			const rewardByDay: RewardByDay[] = JSON.parse(task.reward_by_day || '');
			const rewardCoins = rewardByDay?.find(
				({ day }) => day === completedDays,
			)?.reward;

			if (!rewardCoins) {
				throw new Error();
			}

			const lastDailyReward = new Date().toUTCString();
			const isCompleted = completedDays === 10;

			return {
				rewardCoins,
				isCompleted,
				completedDays,
				lastDailyReward,
			};
		}

		default:
			return;
	}
}

export function calculatePassiveIncome(photos?: UserPhoto[] | null) {
	return (
		photos?.reduce((total, photo) => {
			const photoPassiveIncome =
				levelToPhotoPassiveIncome.get(photo.level_at_time as Level)! || 0;
			return total + photoPassiveIncome;
		}, 0) ?? 0
	);
}

export function getPassiveIncome(
	photos: UserPhotoFragment[],
	lastHourlyReward: string,
) {
	const photosPassiveIncome: number = photos.reduce((total, photo) => {
		/* means that we will calculate passive since the photo creation time */
		const isDoneAfterLastReward =
			new Date(photo.created_at) > new Date(lastHourlyReward);
		const lastClaimedReward = isDoneAfterLastReward
			? photo.created_at
			: lastHourlyReward;
		const hoursSinceLastReward = hoursSinceDate(lastClaimedReward);
		const photoPassiveIncomePerHour =
			levelToPhotoPassiveIncome.get(photo.level_at_time as Level) ?? 0;
		let hours = hoursSinceLastReward > 3 ? 3 : hoursSinceLastReward;
		const reward = hours * photoPassiveIncomePerHour;

		return total + reward;
	}, 0);

	const roundedPhotosPassiveIncome = Math.round(photosPassiveIncome || 0);
	return roundedPhotosPassiveIncome;
}
