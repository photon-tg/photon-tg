import { Money } from '@/components/Money/Money';
import Tick from '@/../public/assets/icons/tick.svg';
import { useModalContext } from '@/contexts/ModalContext';
import { TaskModal } from './TaskModal';
import { RewardByDay, TaskType as TaskTypeType } from '@/types/Task';
import { Task as TaskType } from '@/model/application/types';
import { useSelector } from 'react-redux';
import {
	userCoinsSelector,
	userDailyPhotoIsCompleted,
	userIsDailyRewardClaimedSelector,
	userTasksSelector,
} from '@/model/user/selectors';
import { UserTaskFragment } from '@/gql/graphql';
import { getUserLevel } from '@/constants';

interface TaskProps {
	task: TaskType;
}

export function Task(props: TaskProps) {
	const { task } = props;

	const isClickable = true;

	const { openModal } = useModalContext();
	const isDailyRewardClaimed = useSelector(userIsDailyRewardClaimedSelector);
	const isDailyPhotoCompleted = useSelector(userDailyPhotoIsCompleted);
	const userTasks = useSelector(userTasksSelector);
	const userTask = userTasks.find((ut) => ut.tasks.id === task.id);

	const isCompleted = getIsTaskCompleted(
		userTask,
		task,
		isDailyPhotoCompleted,
		isDailyRewardClaimed,
	);

	const onClick = () => {
		if (task.type === 'link' && isCompleted) {
			return;
		}

		openModal(<TaskModal taskId={task.id} />);
	};

	return (
		<button
			onClick={onClick}
			className={` ${!isCompleted && 'shadow-[0_0_15px_3px_rgba(33,82,149,0.2)]'} grid w-full grid-cols-[max-content_1fr_max-content] gap-x-[10px] rounded bg-[#205295] px-[12px] py-[15px] text-start ${isClickable && !isCompleted && 'active:bg-[#183368]'} `}
		>
			<div>
				<img
					className={'rounded-[5px]'}
					width={45}
					src={task.images?.url || ''}
				/>
			</div>
			<div className={'grid gap-y-[5px]'}>
				<span className={'text-lg font-medium'}>{task.name}</span>
				<TaskRewardBlock task={task} />
			</div>
			{isCompleted && (
				<div
					className={
						'flex h-[45px] w-[45px] items-center justify-center rounded-[50%] bg-gradient-to-r from-text-blue to-[#00E1FF]'
					}
				>
					<Tick />
				</div>
			)}
		</button>
	);
}

interface TaskRewardBlockProps {
	task: TaskType;
}

function TaskRewardBlock(props: TaskRewardBlockProps) {
	const { task } = props;

	const userCoins = useSelector(userCoinsSelector);
	const userLevel = getUserLevel(userCoins);

	if (task.id === 'daily_photo') {
		return (
			<div className={'flex gap-x-[10px]'}>
				<Money
					size={'xs'}
					amount={task.rewardByLevel?.[userLevel].coins!}
					isCompact
				/>
				<Money
					size={'xs'}
					amount={task.rewardByLevel?.[userLevel].passive!}
					perHour
				/>
			</div>
		);
	}

	return (
		<div className={'flex items-center gap-x-[10px]'}>
			<Money
				size={'md'}
				isCompact
				amount={getTaskRewardAmount(
					task.type,
					task.rewardByDay,
					task.reward_coins,
				)}
			/>
		</div>
	);
}

function getTaskRewardAmount(
	taskType: string,
	rewardByDay: RewardByDay[] | undefined,
	rewardCoins: number | null | undefined,
): number {
	switch (taskType as TaskTypeType) {
		case 'daily_reward': {
			return rewardByDay?.slice(-1)[0].reward as number;
		}
		default:
			return rewardCoins as number;
	}
}

function getIsTaskCompleted(
	userTask: UserTaskFragment | undefined,
	task: TaskType,
	isDailyPhotoCompleted: boolean,
	isDailyRewardClaimed: boolean,
) {
	if (task.id === 'daily_photo' && isDailyPhotoCompleted) {
		return true;
	}

	if (task.id === 'daily_reward' && isDailyRewardClaimed) {
		return true;
	}

	return !!userTask?.completed;
}
