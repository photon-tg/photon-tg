'use client';

import { Task } from './Task';
import { useSelector } from 'react-redux';
import { applicationTasksSelector } from '@/model/application/selectors';

export function TasksList() {
	const tasks = useSelector(applicationTasksSelector);

	return (
		<div>
			<span className={'mb-[15px] block text-lg font-medium'}>Daily tasks</span>
			<div className={'flex flex-col gap-y-[10px]'}>
				{tasks.map((task) => (
					<Task key={task.id} task={task} />
				))}
			</div>
		</div>
	);
}
