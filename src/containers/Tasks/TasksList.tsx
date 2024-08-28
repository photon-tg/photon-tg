'use client';

import { useApplicationContext } from '@/contexts/ApplicationContext/ApplicationContext';
import { Task } from './Task';

export function TasksList() {
	const { tasks } = useApplicationContext();

	return (
		<div>
			<span className={'mb-[15px] block text-lg font-medium'}>Daily tasks</span>
			<div className={'flex flex-col gap-y-[10px]'}>
				{tasks.map((task) => (
					<Task key={task.id} {...task} />
				))}
			</div>
		</div>
	);
}
