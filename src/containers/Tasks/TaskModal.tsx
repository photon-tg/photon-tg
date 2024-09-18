import { Button } from '@/components/Button/Button';
import { Money } from '@/components/Money/Money';
import { cn } from '@/utils/cn';
import { PersonalizedTask, RewardByDay } from '@/types/Task';

import { useDispatch, useSelector } from 'react-redux';
import {
	userIsDailyRewardClaimedSelector,
	userSelector,
	userTasksSelector,
} from '@/model/user/selectors';
import { applicationTasksSelector } from '@/model/application/selectors';
import { operationClaimTask } from '@/model/user/operations';
import { TaskFragment, UserTaskFragment } from '@/gql/graphql';

export interface TaskModalProps {
	taskId: string;
}

export function TaskModal(props: TaskModalProps) {
	const { taskId } = props;
	const tasks = useSelector(applicationTasksSelector);
	const userTasks = useSelector(userTasksSelector);
	const isDailyRewardClaimed = useSelector(userIsDailyRewardClaimedSelector);
	const userTask = userTasks.find((task) => task.tasks.id === taskId);
	const task = tasks.find((task) => task.id === taskId);

	const user = useSelector(userSelector);

	if (!task) {
		return null;
	}

	return (
		<div className={'flex flex-col'}>
			<img
				width={200}
				className={'mx-auto mb-[5px]'}
				src={task.images?.url || ''}
			/>
			<span className={'mb-[10px] text-center text-xxl'}>{task.name}</span>
			<p className={'mb-[20px] text-center text-md font-normal'}>
				{task.description}
			</p>
			{task.rewardByDay && (
				<DailyRewardModal
					isDailyRewardClaimed={isDailyRewardClaimed}
					lastClaimedDailyReward={user.last_daily_reward}
					task={task}
					userTask={userTask}
				/>
			)}
		</div>
	);
}

interface DailyRewardModalProps {
	isDailyRewardClaimed?: boolean;
	lastClaimedDailyReward?: string | null;
	task: TaskFragment;
	userTask?: UserTaskFragment;
}

function DailyRewardModal(props: DailyRewardModalProps) {
	const { task, userTask, isDailyRewardClaimed } = props;

	const dispatch = useDispatch();

	const onClaim = () => {
		dispatch(operationClaimTask({ type: 'daily_reward', userTask, task }));
	};

	return (
		<div className={'mb-[20px] flex flex-col gap-y-[10px]'}>
			<div
				style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))' }}
				className={'grid max-h-[250px] gap-[10px] overflow-y-scroll'}
			>
				{(JSON.parse(task.reward_by_day || '') as RewardByDay[])?.map((day) => (
					<Day
						key={day.day}
						day={day}
						task={task}
						userTask={userTask}
						isDailyRewardClaimed={isDailyRewardClaimed}
					/>
				))}
			</div>
			<Button
				disabled={isDailyRewardClaimed}
				onClick={onClaim}
				variant={'filled'}
			>
				Claim
			</Button>
		</div>
	);
}

interface DayProps {
	task: TaskFragment;
	userTask?: UserTaskFragment;
	isDailyRewardClaimed?: boolean;
	lastClaimedDailyReward?: string | null;
	day: RewardByDay;
}

function Day(props: DayProps) {
	const { task, userTask, isDailyRewardClaimed, lastClaimedDailyReward, day } =
		props;

	const completedDays = userTask?.days_completed || 0;
	const isDayCompleted = day.day <= completedDays;
	const isAvailable = day.day === completedDays + 1 && !isDailyRewardClaimed;
	const isNotYetAvailable =
		day.day === completedDays + 1 && isDailyRewardClaimed;

	console.log(userTask, isDailyRewardClaimed, day, 'day');
	return (
		<div
			className={cn(
				'flex flex-col gap-y-[2px] overflow-hidden rounded border-[2px] border-[transparent] bg-[#1b2b50] px-[11px] py-[11px]',
				isAvailable && 'border-[yellow]',
				isDayCompleted && 'bg-[#0F3F99]',
				isNotYetAvailable && 'bg-[#1b2b50]',
			)}
		>
			<span className={'mb-[15px] text-md'}>Day {day.day}</span>
			<Money isCompact amount={day.reward} size={'xs'} />
		</div>
	);
}
