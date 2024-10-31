'use client';

import { useSelector } from 'react-redux';
import { userCoinsSelector } from '@/model/user/selectors';

export function Coins() {
	const coins = useSelector(userCoinsSelector);
	return (
		<div className={'flex items-center gap-x-[10px] justify-self-center'}>
			<img width={26} src={'/assets/icons/photon.svg'} />
			<span className={'text-lg font-semibold'}>{coins}</span>
		</div>
	);
}
