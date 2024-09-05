import { useCallback } from 'react';
import { User } from '@/interfaces/User';
import { updateDailyRewardCompletedDays } from '@/api/api';
import { PersonalizedTask } from '@/interfaces/Task';
import { daysSinceDate } from '@/utils/date';

export function useTasks(user: User) {
	const initDailyReward = useCallback(async (tasks?: PersonalizedTask[]): Promise<[null | string | undefined, PersonalizedTask[] | undefined]> => {
		const dailyRewardTask = tasks?.find((task) => task.id === 'daily_reward');
		const daysSinceLastDailyReward = user.last_daily_reward ? daysSinceDate(user.last_daily_reward) : 0;

		if (daysSinceLastDailyReward > 1) {
			// user started daily quest but skipped day(s)
			const newTask = await updateDailyRewardCompletedDays(
				user.id,
				dailyRewardTask?.userTask?.id!,
				0,
			);
			const newTasks = tasks?.map((t) => t.id === newTask.id ? newTask : t);
			return [null, newTasks];
		}

		return [user.last_daily_reward, undefined];
	}, [user.id, user.last_daily_reward]);

	return {
		initDailyReward,
	}
}
