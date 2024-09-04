'use client';

import { TasksList } from './TasksList';

export function Tasks() {
	return (
		<div className={'grid overflow-auto px-[15px] pb-[20px] pt-[35px]'}>
			<img
				width={100}
				className={'mb-[10px] justify-self-center'}
				src={'https://hnvngbrjzbcenxwmzzrk.supabase.co/storage/v1/object/public/application/public/check.svg'}
			/>
			<h1 className={'mb-[50px] justify-self-center text-xxl'}>Tasks</h1>
			<div className={'flex flex-col gap-y-[40px]'}>
				<TasksList />
			</div>
		</div>
	);
}
