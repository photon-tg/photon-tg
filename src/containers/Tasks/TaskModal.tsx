import { Button } from '@/components/Button/Button';
import { Money } from '@/components/Money/Money';
import { useUserContext } from '@/contexts/UserContext';
import { cn } from '@/utils/cn';
import { PersonalizedTask, RewardByDay } from '@/interfaces/Task';

import { useApplicationContext } from '@/contexts/ApplicationContext/ApplicationContext';

export interface TaskModalProps {
	taskId: string;
}

export function TaskModal(props: TaskModalProps) {
	const { taskId } = props;
	const { tasks, isDailyRewardClaimed } = useApplicationContext();

	const task = tasks.find((task) => task.id === taskId);

	const { user } = useUserContext();

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
				/>
			)}
		</div>
	);
}

interface DailyRewardModalProps {
	isDailyRewardClaimed?: boolean;
	lastClaimedDailyReward?: string | null;
	task: PersonalizedTask;
}

function DailyRewardModal(props: DailyRewardModalProps) {
	const {
		task,
		isDailyRewardClaimed,
	} = props;

	const { claimTask } = useApplicationContext();

	const onClaim = () => {
		claimTask('daily_reward', task);
	};
	console.log(task);
	return (
		<div className={'flex flex-col gap-y-[10px]'}>
			<div
				style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))' }}
				className={'grid max-h-[250px] gap-[10px] overflow-y-scroll'}
			>
				{task.rewardByDay?.map((day) =>
					<Day key={day.day} day={day} task={task} isDailyRewardClaimed={isDailyRewardClaimed} />
				)}
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
	task: PersonalizedTask,
	isDailyRewardClaimed?: boolean;
	lastClaimedDailyReward?: string | null;
	day: RewardByDay;
}

function Day(props: DayProps) {
	const { task, isDailyRewardClaimed, lastClaimedDailyReward, day } = props;

	const completedDays = task.userTask?.days_completed || 0;
	const isDayCompleted = day.day <= completedDays;
	const isAvailable = day.day === (completedDays + 1) && !isDailyRewardClaimed;
	const isNotYetAvailable =
		day.day === (completedDays + 1) && isDailyRewardClaimed;


	return (
		<div
			className={cn(
				'flex flex-col gap-y-[2px] overflow-hidden rounded bg-inactive-grey px-[13px] py-[13px]',
				isAvailable && 'border-[2px] border-[yellow]',
				isDayCompleted && 'bg-light-blue',
				isNotYetAvailable && 'bg-inactive-grey',
			)}
		>
			<span className={'mb-[15px] text-md'}>Day {day.day}</span>
			<Money isCompact amount={day.reward} size={'xs'} />
		</div>
	)
}
