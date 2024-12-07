import ArrowIcon from '../../../../../public/assets/icons/Photo/arrow-left.svg';
import { MyStats } from '@/containers/Battle/LeaderBoard/Statistics/MyStats';
import { Button } from '@/components/Button/Button';
import { useDispatch, useSelector } from 'react-redux';
import {
	battleBattlesSelector,
	battleSelectedBattleDataSelector,
	battleSelectedBattleSelector,
	battleSelectedBattleUserPhoto,
} from '@/model/battle/selectors';
import { operationBattleSelect } from '@/model/battle/operations/operationBattleSelect';
import { useRouter } from 'next/navigation';
import { useContext } from 'react';
import { AppContext } from '@/contexts/AppContext';
import { useContent } from '@/containers/Battle/useContent';

export function Statistics() {
	const dispatch = useDispatch();
	const battles = useSelector(battleBattlesSelector);
	const selectedBattle = useSelector(battleSelectedBattleSelector);
	const { battlesContent, lang } = useContext(AppContext);
	const translation = battlesContent.find((c) => c.id === selectedBattle?.id);

	const changeBattle = (type: 'next' | 'prev') => {
		const currentIndex = battles.findIndex(
			({ id }) => id === selectedBattle?.id,
		);
		const nextIndex = type === 'next' ? currentIndex + 1 : currentIndex - 1;
		if (nextIndex >= 0 && nextIndex <= battles.length - 1) {
			dispatch(operationBattleSelect(battles[nextIndex].id));
		}
	};

	if (!selectedBattle) return null;

	return (
		<div className={'pt-[10px]'}>
			<header
				className={
					'flex items-center justify-between rounded-tl-[10px] rounded-tr-[10px] bg-[#0E3888F2] px-[10px] pb-[5px] pt-[5px]'
				}
			>
				<button
					onClick={() => changeBattle('prev')}
					className={'px-[10px] py-[10px]'}
				>
					<ArrowIcon />
				</button>
				<div>
					<span>{translation?.name?.[lang]}</span>
				</div>
				<button
					onClick={() => changeBattle('next')}
					className={'rotate-180 px-[10px] py-[10px]'}
				>
					<ArrowIcon />
				</button>
			</header>
			<div className={'h-[300px]'}>
				<StatisticsContent />
			</div>
		</div>
	);
}

function StatisticsContent() {
	const selectedBattle = useSelector(battleSelectedBattleDataSelector);
	const selectedBattlePhoto = useSelector(battleSelectedBattleUserPhoto);
	const router = useRouter();
	const { lang } = useContext(AppContext);
	const content = useContent();
	if (!selectedBattlePhoto && selectedBattle?.is_active) {
		return (
			<div
				className={
					'flex h-[300px] flex-col items-center justify-center rounded-bl-[10px] rounded-br-[10px] bg-[#205295] px-[30px] py-[30px]'
				}
			>
				<img className={'mb-[30px]'} src={'/assets/icons/sad.svg'} />
				<p className={'mb-[20px] text-sm font-semibold'}>
					{content.youHaveNotJoinedTheBattleYet}
				</p>
				<Button variant={'filled'} onClick={() => router.push('/photo/camera')}>
					{content.joinTheBattle}
				</Button>
			</div>
		);
	}

	if (!selectedBattlePhoto && !selectedBattle?.is_active) {
		return (
			<div
				className={
					'flex h-[300px] flex-col items-center justify-center rounded-bl-[10px] rounded-br-[10px] bg-[#205295] px-[30px] py-[30px]'
				}
			>
				<img className={'mb-[30px]'} src={'/assets/icons/sad.svg'} />
				<p className={'mb-[20px] text-sm font-semibold'}>
					{content.youHaveMissedTheBattle}
				</p>
				<Button
					onClick={() => router.push(`/${lang}/photo/camera`)}
					variant={'filled'}
				>
					{content.joinCurrentBattle}
				</Button>
			</div>
		);
	}

	return (
		<div
			className={
				'grid max-h-[300px] grid-cols-2 rounded-bl-[10px] rounded-br-[10px] bg-[#205295]'
			}
		>
			<img
				className={'h-[300px] rounded-bl-[10px] object-cover'}
				src={selectedBattlePhoto?.photo_url}
			/>
			<MyStats />
		</div>
	);
}
