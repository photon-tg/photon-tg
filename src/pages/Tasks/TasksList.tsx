'use client';

import { Task } from './Task';
import { useSelector } from 'react-redux';
import { applicationTasksSelector } from '@/model/application/selectors';
import { TaskFragment } from '@/gql/graphql';

const normalTasksList: string[] = ['task', 'link'];

export function TasksList({ tasks }: { tasks: TaskFragment[] }) {
	const sortedTasks = [...tasks].sort((a, b) => b.priority - a.priority);

	const dailyTasks = sortedTasks.filter(
		(task) => task.type === 'daily_reward' || task.id === 'daily_photo',
	);
	const normalTasks = sortedTasks.filter(
		(task) => normalTasksList.includes(task.type) && task.id !== 'daily_photo',
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
