import { Button } from '@/components/Button/Button';
import { useRouter } from 'next/navigation';
import { Money } from '@/components/Money/Money';
import {
	getUserLevel,
	levelToPhotoPassiveIncome,
	levelToPhotoReward,
} from '@/constants';
import { useSelector } from 'react-redux';
import { userCoinsSelector } from '@/model/user/selectors';
import { useMemo } from 'react';
import {
	battleCanJoinSelector,
	battleHasJoinedSelector,
	battleTimeLeftToJoinSelector,
} from '@/model/battle/selectors';

export function BattleActions() {
	const userCoins = useSelector(userCoinsSelector);
	const userLevel = getUserLevel(userCoins);
	const router = useRouter();
	const canJoin = useSelector(battleCanJoinSelector);
	const hasJoined = useSelector(battleHasJoinedSelector);
	const timeLeftToJoin = useSelector(battleTimeLeftToJoinSelector);
	const onJoinBattleClick = () => {
		router.push('/photo/camera');
	};

	const formattedTimeLeft = useMemo(() => {
		if (timeLeftToJoin === null) return '';
		const hours = Math.floor(timeLeftToJoin / 60)
			.toString()
			.padStart(2, '0');
		const minutes = (timeLeftToJoin % 60).toString().padStart(2, '0');
		return `${hours}:${minutes}`;
	}, [timeLeftToJoin]);

	return (
		<div className={'grid grid-flow-col grid-cols-2 gap-x-[3px]'}>
			<Button
				disabled={!canJoin}
				height={'52px'}
				onClick={onJoinBattleClick}
				size={'sm'}
				variant={'filled'}
			>
				{hasJoined ? (
					<div className={'flex items-center justify-center gap-x-[5px]'}>
						<span className={'mb-[2px] text-[15px] text-sm'}>
							You have joined
						</span>
					</div>
				) : canJoin ? (
					<div className={'flex flex-col'}>
						<span className={'mb-[2px] text-[15px] text-sm'}>
							Join current battle
						</span>
						<div className={'flex items-center gap-x-[5px] self-start'}>
							<div
								className={
									'text-xs flex gap-x-[3px] font-semibold text-[#42C2FF]'
								}
							>
								<Money
									bold
									activeColor
									isCompact
									withoutPlus
									amount={levelToPhotoReward.get(userLevel)!}
									size={'xxs'}
								/>
								+
								<Money
									bold
									activeColor
									isCompact
									withoutPlus
									withoutCoin
									perHour
									amount={levelToPhotoPassiveIncome.get(userLevel)!}
									size={'xxs'}
								/>
							</div>
							<div className={'flex items-center gap-x-[1px] text-sm'}>
								<img src={'/assets/icons/alarm.svg'} /> {formattedTimeLeft}
							</div>
						</div>
					</div>
				) : (
					<div className={'flex items-center justify-center gap-x-[5px]'}>
						<span className={'mb-[2px] text-[15px] text-sm'}>
							Next battle in
						</span>
						<div className={'flex items-center gap-x-[3px] text-sm'}>
							<img src={'/assets/icons/alarm.svg'} /> {formattedTimeLeft}
						</div>
					</div>
				)}
			</Button>
			<Button
				height={'52px'}
				onClick={() => router.push('/battle/leaderboard')}
				size={'sm'}
				variant={'outline'}
			>
				<span className={'text-[13px] text-sm'}>Check battle leaders</span>
			</Button>
		</div>
	);
}
