'use client';

import { Task } from './Task';
import { useSelector } from 'react-redux';
import { applicationTasksSelector } from '@/model/application/selectors';

const normalTasksList: string[] = ['task', 'link'];

export function TasksList() {
	const tasks = useSelector(applicationTasksSelector);
	const dailyTasks = tasks.filter((task) => task.type === 'daily_reward');
	const normalTasks = tasks.filter((task) =>
		normalTasksList.includes(task.type),
	);

	return (
		<div className={'flex flex-col gap-y-[25px]'}>
			{!!dailyTasks.length && (
				<div>
					<span className={'mb-[12px] block text-lg font-medium'}>
						Daily tasks
					</span>
					<div className={'flex flex-col gap-y-[10px]'}>
						{dailyTasks.map((task) => (
							<Task key={task.id} task={task} />
						))}
					</div>
				</div>
			)}
			{!!normalTasks.length && (
				<div>
					<span className={'mb-[12px] block text-lg font-medium'}>
						Tasks list
					</span>
					<div className={'flex flex-col gap-y-[10px]'}>
						{normalTasks.map((task) => (
							<Task key={task.id} task={task} />
						))}
					</div>
				</div>
			)}
		</div>
	);
}
