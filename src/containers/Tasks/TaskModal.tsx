import { useSelector } from 'react-redux';
import { userTasksSelector } from '@/model/user/selectors';
import { applicationTasksSelector } from '@/model/application/selectors';

import { isToday } from '@/utils/date';
import { DailyRewardModal } from '@/containers/Tasks/modals/DailyRewardModal';
import { DailyPhotoModal } from '@/containers/Tasks/modals/DailyPhotoModal';
import { LinkModal } from '@/containers/Tasks/modals/LinkModal';
import { activeJoinBattleIdSelector } from '@/model/battle/selectors';
import { useContext } from 'react';
import { AppContext } from '@/contexts/AppContext';

export interface TaskModalProps {
	taskId: string;
}

export function TaskModal(props: TaskModalProps) {
	const { taskId } = props;
	const tasks = useSelector(applicationTasksSelector);
	const userTasks = useSelector(userTasksSelector);
	const userTask = userTasks.find((task) => task.tasks.id === taskId);
	const task = tasks.find((task) => task.id === taskId);
	const activeJoinBattleId = useSelector(activeJoinBattleIdSelector);
	const { lang, battlesContent } = useContext(AppContext);
	const tr = battlesContent.find((c) => c.id === activeJoinBattleId);

	if (!task) {
		return null;
	}

	const isCMS = task.id === 'daily_photo';

	const todaysText = task.textByDate?.find((tbd) => isToday(tbd.date));
	const name = isCMS ? tr?.name?.[lang] : todaysText?.name || task.name;
	const description = isCMS
		? tr?.description?.[lang]
		: todaysText?.description
			? `"${todaysText?.description}"`
			: task.description;

	return (
		<div className={'flex flex-col'}>
			<img
				width={200}
				className={'mx-auto mb-[10px] rounded-[5px]'}
				src={task.images?.url || ''}
			/>
			<span className={'mx-auto mb-[10px] max-w-[80%] text-center text-xxl'}>
				{name}
			</span>
			<p
				className={
					'mx-auto mb-[20px] max-w-[80%] text-pretty text-center text-md font-normal'
				}
			>
				{description}
			</p>
			{task.rewardByDay && <DailyRewardModal task={task} userTask={userTask} />}

			{task.rewardByLevel && (
				<DailyPhotoModal task={task} userTask={userTask} />
			)}
			{task.link && <LinkModal task={task} userTask={userTask} />}
		</div>
	);
}
