'use client';

import { TasksList } from './TasksList';
import { useSelector } from 'react-redux';
import { applicationTasksSelector } from '@/model/application/selectors';
import Spinner from '@/components/Spinner';
import { Button } from '@/components/Button/Button';

export function Tasks() {
	const tasks = useSelector(applicationTasksSelector);
	return (
		<div className={'grid overflow-auto px-[15px] pb-[20px] pt-[35px]'}>
			<img
				width={100}
				className={'mb-[10px] justify-self-center'}
				src={
					'https://hnvngbrjzbcenxwmzzrk.supabase.co/storage/v1/object/public/application/public/check.svg'
				}
			/>
			<h1 className={'mb-[50px] justify-self-center text-xxl'}>Tasks</h1>
			<div className={'flex flex-col gap-y-[40px]'}>
				{!!tasks.length ? (
					<TasksList tasks={tasks} />
				) : (
					<div className={'flex flex-col items-center gap-y-[30px]'}>
						<Spinner />
						<Button
							width={'fit-content'}
							onClick={() => {
								window.location.reload();
							}}
						>
							Retry
						</Button>
					</div>
				)}
			</div>
		</div>
	);
}
