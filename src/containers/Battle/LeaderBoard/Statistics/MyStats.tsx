import { formatNumber } from '@/utils/formatter';
import { Money } from '@/components/Money/Money';
import Calendar from '../../../../../public/assets/icons/calendar.svg';
import { useSelector } from 'react-redux';
import {
	battleSelectedBattleSelector,
	battleSelectedBattleUserPhoto,
} from '@/model/battle/selectors';
import { formatDate } from '@/utils/date';
import {
	Level,
	levelToPhotoPassiveIncome,
	levelToPhotoReward,
	levelToReceiveLikeReward,
} from '@/constants';
import { userSelector } from '@/model/user/selectors';
import { Top } from '@/model/battle/types';

const getTopSign = (place: number) => {
	if (place <= 3) return 3;
	if (place <= 10) return 10;
	if (place <= 100) return 100;
	if (place <= 1000) return 1000;
	if (place <= 10000) return 10000;
};

export function MyStats() {
	const selectedBattlePhoto = useSelector(battleSelectedBattleUserPhoto);
	const selectedBattle = useSelector(battleSelectedBattleSelector);
	const user = useSelector(userSelector);
	const a = (selectedBattle?.top as Top[])?.findIndex(
		(a) => a.username === user.username,
	);
	if (!selectedBattlePhoto) {
		return null;
	}

	const { likes_count, user_level } = selectedBattlePhoto;

	return (
		<div
			className={
				'flex h-[300px] flex-col gap-y-[15px] px-[15px] pb-[10px] pt-[8px]'
			}
		>
			<span
				className={
					'self-center rounded-[20px] bg-[#0F1B38] px-[20px] py-[5px] text-md'
				}
			>
				Top {getTopSign(a + 1)}
			</span>
			<div>
				<span className={'mb-[8px] block text-sm font-semibold'}>
					Battle reward:
				</span>
				<div className={'flex flex-col justify-start gap-y-[5px]'}>
					<span className={'flex flex-row items-center gap-x-[4px] text-sm'}>
						<img width={19} src={'/assets/icons/like.svg'} />
						{formatNumber(likes_count)}
					</span>
					<Money
						amount={
							likes_count * levelToReceiveLikeReward.get(user_level as Level)!
						}
						size={'xs'}
					/>
				</div>
			</div>
			<div>
				<span className={'mb-[8px] block text-sm font-semibold'}>
					Reward for joining:
				</span>
				<div className={'flex flex-col justify-start gap-y-[5px]'}>
					<Money
						amount={
							levelToPhotoReward.get(selectedBattlePhoto?.user_level as Level)!
						}
						size={'xs'}
					/>
					<Money
						perHour
						amount={
							levelToPhotoPassiveIncome.get(
								selectedBattlePhoto?.user_level as Level,
							)!
						}
						size={'xs'}
					/>
				</div>
			</div>
			<div className={'flex items-center gap-x-[7px]'}>
				<Calendar width={18} height={18} />
				<span className={'text-sm font-semibold'}>
					{selectedBattlePhoto?.created_at &&
						formatDate(new Date(selectedBattlePhoto.created_at))}
				</span>
			</div>
		</div>
	);
}
