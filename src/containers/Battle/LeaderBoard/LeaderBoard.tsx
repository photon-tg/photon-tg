'use client';

import { Statistics } from '@/containers/Battle/LeaderBoard/Statistics/Statistics';
import { Top } from '@/containers/Battle/LeaderBoard/Top';

export function LeaderBoard() {
	return (
		<div className={'flex flex-col gap-y-[10px] px-[15px]'}>
			<Statistics />
			<Top />
		</div>
	);
}
