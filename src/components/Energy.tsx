'use client';

import { useSelector } from 'react-redux';
import { userCoinsSelector, userEnergySelector } from '@/model/user/selectors';
import { getUserLevel, levelToMaxEnergy } from '@/constants';

export function Energy() {
	const energy = useSelector(userEnergySelector);
	const coins = useSelector(userCoinsSelector);
	const level = getUserLevel(coins);
	const maxEnergy = levelToMaxEnergy.get(level);

	return (
		<div className={'flex flex-row items-center gap-x-[10px]'}>
			<img width={14} src={'/assets/icons/energy.svg'} />
			<span className={'text-lg font-semibold'}>
				{energy} / {maxEnergy}
			</span>
		</div>
	);
}
