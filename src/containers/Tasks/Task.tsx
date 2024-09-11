import { Money } from '@/components/Money/Money';
import Tick from '@/../public/assets/icons/tick.svg';
import { useModalContext } from '@/contexts/ModalContext';
import { TaskModal } from './TaskModal';
import { PersonalizedTask, RewardByDay, TaskType } from '@/types/Task';

import { useSelector } from 'react-redux';
import { userIsDailyRewardClaimedSelector } from '@/model/user/selectors';

interface TaskProps {
	task: PersonalizedTask;
}

export function Task(props: TaskProps) {
	const { task } = props;

	const isClickable = true;

	const { openModal } = useModalContext();
	const isDailyRewardClaimed = useSelector(userIsDailyRewardClaimedSelector);

	const onClick = () => {
		openModal(<TaskModal taskId={task.id} />);
	};

	return (
		<button
			onClick={onClick}
			className={`grid text-start w-full grid-cols-[max-content_1fr_max-content] gap-x-[10px] rounded bg-[#205295] px-[12px] py-[10px] ${isClickable && 'active:bg-[#183368]'}`}
		>
			<div>
				<img width={45} src={task.images?.url || ''} />
			</div>
			<div className={'grid gap-y-[5px]'}>
				<span className={'text-lg font-medium'}>{task.name}</span>
				<div className={'flex items-center gap-x-[10px]'}>
					<Money
						size={'md'}
						isCompact
						amount={getTaskRewardAmount(task.type, task.rewardByDay, task.reward_coins)}
					/>
				</div>
			</div>
			{task.userTask?.completed || (task.type === 'daily_reward' && isDailyRewardClaimed) && (
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

function getTaskRewardAmount(
	taskType: string,
	rewardByDay: RewardByDay[] | undefined,
	rewardCoins: number | null | undefined,
): number {
	switch (taskType as TaskType) {
		case 'daily_reward': {
			return rewardByDay?.slice(-1)[0].reward as number;
		}
		default:
			return rewardCoins as number;
	}
}
