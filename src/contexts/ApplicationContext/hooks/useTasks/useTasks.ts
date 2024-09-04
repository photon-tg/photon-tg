import { useCallback } from 'react';
import { User } from '@/interfaces/User';
import { daysSinceDate } from '@/utils/date';
import { updateDailyRewardCompletedDays } from '@/api/api';
import { PersonalizedTask } from '@/interfaces/Task';

export function useTasks(user: User) {
	const initDailyReward = useCallback(async (tasks?: PersonalizedTask[]) => {
		const dailyRewardTask = tasks?.find((task) => task.id === 'daily_reward');
		const lastDailyReward = user.last_daily_reward && new Date(user.last_daily_reward);
		const daysSinceLastDailyReward = lastDailyReward ? daysSinceDate(lastDailyReward) : 0;
		if (daysSinceLastDailyReward > 1) {
			// user started daily quest but skipped day(s)
			await updateDailyRewardCompletedDays(
				user.id,
				dailyRewardTask?.userTask?.id!,
				0,
			);
		}
	}, [user.id, user.last_daily_reward]);

	return {
		initDailyReward,
	}
}
