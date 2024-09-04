import { useCallback } from 'react';
import { User } from '@/interfaces/User';
import { updateDailyRewardCompletedDays } from '@/api/api';
import { PersonalizedTask } from '@/interfaces/Task';
import { daysSinceDate } from '@/utils/date';

export function useTasks(user: User) {
	const initDailyReward = useCallback(async (tasks?: PersonalizedTask[]) => {
		const dailyRewardTask = tasks?.find((task) => task.id === 'daily_reward');
		const daysSinceLastDailyReward = user.last_daily_reward ? daysSinceDate(user.last_daily_reward) : 0;
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
