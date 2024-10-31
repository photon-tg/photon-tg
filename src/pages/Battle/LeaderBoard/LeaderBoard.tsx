'use client';

import { Statistics } from '@/pages/Battle/LeaderBoard/Statistics/Statistics';
import { Top } from '@/pages/Battle/LeaderBoard/Top';

export function LeaderBoard() {
	return (
		<div className={'flex flex-col gap-y-[10px] px-[15px]'}>
			<Statistics />
			<Top />
		</div>
	);
}
