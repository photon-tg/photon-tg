import { formatNumber } from '@/utils/formatter';
import { Money } from '@/components/Money/Money';
import Calendar from '../../../../../public/assets/icons/calendar.svg';
import { useSelector } from 'react-redux';
import { battleSelectedBattleUserPhoto } from '@/model/battle/selectors';
import { formatDate } from '@/utils/date';
import {
	Level,
	levelToPhotoPassiveIncome,
	levelToPhotoReward,
} from '@/constants';

export function MyStats() {
	const selectedBattlePhoto = useSelector(battleSelectedBattleUserPhoto);
	return (
		<div
			className={
				'flex h-[280px] flex-col gap-y-[15px] px-[15px] pb-[10px] pt-[8px]'
			}
		>
			<span
				className={
					'self-center rounded-[20px] bg-[#0F1B38] px-[20px] py-[5px] text-md'
				}
			>
				Top 100
			</span>
			<div>
				<span className={'mb-[8px] block text-sm font-semibold'}>
					Battle reward:
				</span>
				<div className={'flex flex-col justify-start gap-y-[5px]'}>
					<span className={'flex flex-row items-center gap-x-[4px] text-sm'}>
						<img width={19} src={'/assets/icons/like.svg'} />
						{formatNumber(selectedBattlePhoto?.likes_count || 0)}
					</span>
					<Money amount={10000} size={'xs'} />
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
