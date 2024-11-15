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
import { useContext, useMemo } from 'react';
import {
	activeJoinBattleIdSelector,
	activeVoteBattleIdSelector,
	battleHasJoinedSelector,
	battleTimeLeftToJoinSelector,
} from '@/model/battle/selectors';
import { AppContext } from '@/contexts/AppContext';
import { useContent } from '@/containers/Battle/useContent';

export function BattleActions() {
	const userCoins = useSelector(userCoinsSelector);
	const userLevel = getUserLevel(userCoins);
	const router = useRouter();
	const hasJoined = useSelector(battleHasJoinedSelector);
	const timeLeftToJoin = useSelector(battleTimeLeftToJoinSelector);
	const voteBattleId = useSelector(activeVoteBattleIdSelector);
	const joinBattleId = useSelector(activeJoinBattleIdSelector);
	const { lang } = useContext(AppContext);
	const onJoinBattleClick = () => {
		router.push(`/${lang}/photo/camera`);
	};

	const content = useContent();
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
				disabled={hasJoined}
				height={'52px'}
				onClick={onJoinBattleClick}
				size={'sm'}
				variant={'filled'}
			>
				{hasJoined ? (
					<div className={'flex items-center justify-center gap-x-[5px]'}>
						<span className={'mb-[2px] text-[15px] text-sm'}>
							{content.youHaveJoined}
						</span>
					</div>
				) : (
					<div className={'flex flex-col'}>
						<span className={'mb-[2px] text-[15px] text-sm'}>
							{joinBattleId === voteBattleId
								? content.joinCurrentBattle
								: content.joinNextBattle}
						</span>
						<div className={'flex items-center gap-x-[2px] self-start'}>
							<div className={'text-xs flex text-[#42C2FF]'}>
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
				)}
			</Button>
			<Button
				height={'52px'}
				onClick={() => router.push(`/${lang}/battle/leaderboard`)}
				size={'sm'}
				variant={'outline'}
			>
				<span className={'text-[13px] text-sm'}>
					{content.checkBattleLeaders}
				</span>
			</Button>
		</div>
	);
}
