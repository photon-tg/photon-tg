import { useEffect } from 'react';
import { getUserLevel, levelToSelectReward } from '@/constants';
import { useSelector } from 'react-redux';
import { userCoinsSelector } from '@/model/user/selectors';

export interface BattleRewardProps {
	onFinish(): void;
}

export function BattleReward({ onFinish }: BattleRewardProps) {
	const userCoins = useSelector(userCoinsSelector);
	const userLevel = getUserLevel(userCoins);
	const selectReward = levelToSelectReward.get(userLevel)!;
	useEffect(() => {
		// const id = setTimeout(onFinish);
		//
		// return () => {
		// 	clearTimeout(id);
		// }
	}, [onFinish]);
	return (
		<div
			className={
				'absolute left-[50%] top-[50%] flex translate-x-[-50%] translate-y-[-50%] items-center gap-x-[5px] rounded-[10px] bg-[rgba(12,37,76,90%)] px-[10px] py-[10px]'
			}
			style={{ backdropFilter: 'blur(3px)' }}
		>
			<img src={'/assets/icons/photon.svg'} />
			<span className={'font-semibold text-[#42C2FF]'}>+{selectReward}</span>
		</div>
	);
}
