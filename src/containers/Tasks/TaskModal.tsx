import { Button } from '@/components/Button/Button';
import { Money } from '@/components/Money/Money';
import { useUserContext } from '@/contexts/UserContext';
import { cn } from '@/utils/cn';
import { RewardByDay } from '@/interfaces/Task';
import { claimDailyReward } from '@/api/api';
import {
	ClaimFirstDailyRewardMutation,
	CoreUserFieldsFragment,
	FullUserTaskFragment,
} from '@/gql/graphql';
import { useApplicationContext } from '@/contexts/ApplicationContext/ApplicationContext';

export interface TaskModalProps {
	taskId: string;
}

export function TaskModal(props: TaskModalProps) {
	const { taskId } = props;
	const { tasks } = useApplicationContext();

	const task = tasks.find((task) => task.id === taskId);

	const { user } = useUserContext();

	if (!task) {
		return null;
	}

	return (
		<div className={'flex flex-col'}>
			<img
				className={'mx-auto mb-[5px] w-[100px]'}
				src={task.images?.url || ''}
			/>
			<span className={'mb-[10px] text-center text-xxl'}>{task.name}</span>
			<p className={'mb-[20px] text-center text-md font-normal'}>
				{task.description}
			</p>
			{task.rewardByDay && (
				<DailyRewardModal
					taskId={taskId}
					userTaskId={task.userTask?.id}
					isDailyRewardClaimed={user?.isDailyRewardClaimed}
					daysCompleted={task.userTask?.days_completed}
					days={task.rewardByDay}
				/>
			)}
		</div>
	);
}

interface DailyRewardModalProps {
	days: RewardByDay[];
	daysCompleted?: number;
	isDailyRewardClaimed?: boolean;
	userTaskId?: string;
	taskId: string;
}

function DailyRewardModal(props: DailyRewardModalProps) {
	const {
		days,
		taskId,
		userTaskId,
		daysCompleted = 0,
		isDailyRewardClaimed,
	} = props;

	const { user, updateLocalUser } = useUserContext();
	const { increaseCoins, updateUserTaskProgress } = useApplicationContext();

	const onClaimReward = async () => {
		window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
		const rewardCoins = days.find(
			({ day }) => day === daysCompleted + 1,
		)?.reward;
		if (!rewardCoins) {
			throw new Error();
		}
		const data = await claimDailyReward(
			user?.id as string,
			taskId,
			userTaskId,
			daysCompleted + 1,
			rewardCoins,
			user.coins,
		);
		const newUserData = data.updateusersCollection[0];
		increaseCoins(rewardCoins);
		updateUserTaskProgress(
			((data.updateuser_tasksCollection as any)?.[0] as FullUserTaskFragment) ||
				(((data as any)
					.insertIntouser_tasksCollection as any)?.[0] as FullUserTaskFragment),
		);
		if (newUserData) {
			updateLocalUser(newUserData as CoreUserFieldsFragment);
		}
	};

	return (
		<div className={'flex flex-col gap-y-[10px]'}>
			<div
				style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))' }}
				className={'grid max-h-[250px] gap-[10px] overflow-y-scroll'}
			>
				{days.map(({ day, reward }) => {
					const completedDay = daysCompleted + 1;
					const isAvailable = day === completedDay && !isDailyRewardClaimed;
					const isNotYetAvailable =
						day === completedDay && isDailyRewardClaimed;

					const isClaimedPrevDay = day <= completedDay;
					return (
						<div
							key={day}
							className={cn(
								'flex flex-col gap-y-[2px] overflow-hidden rounded bg-inactive-grey px-[13px] py-[13px]',
								isAvailable && 'border-[2px] border-[yellow]',
								isClaimedPrevDay && 'bg-light-blue',
								isNotYetAvailable && 'bg-inactive-grey',
							)}
						>
							<span className={'mb-[15px] text-md'}>Day {day}</span>
							<Money isCompact amount={reward} size={'xs'} />
						</div>
					);
				})}
			</div>
			<Button
				disabled={isDailyRewardClaimed}
				onClick={onClaimReward}
				variant={'filled'}
			>
				Claim
			</Button>
		</div>
	);
}
