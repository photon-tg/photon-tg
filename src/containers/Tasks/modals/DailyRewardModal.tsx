import { TaskFragment, UserTaskFragment } from '@/gql/graphql';
import { useDispatch, useSelector } from 'react-redux';
import { RewardByDay } from '@/types/Task';
import { Button } from '@/components/Button/Button';
import { cn } from '@/utils/cn';
import { Money } from '@/components/Money/Money';
import { userIsDailyRewardClaimedSelector } from '@/model/user/selectors';
import { operationTaskClaim } from '@/model/user/operations/operationTaskClaim';

interface DailyRewardModalProps {
	task: TaskFragment;
	userTask?: UserTaskFragment;
}

export function DailyRewardModal(props: DailyRewardModalProps) {
	const { task, userTask } = props;

	const dispatch = useDispatch();
	const isDailyRewardClaimed = useSelector(userIsDailyRewardClaimedSelector);

	const onClaim = () => {
		dispatch(operationTaskClaim({ type: 'daily_reward', userTask, task }));
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
