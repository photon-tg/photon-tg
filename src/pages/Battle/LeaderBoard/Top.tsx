import { useSelector } from 'react-redux';
import { Top as TopType } from '@/model/battle/types';
import { battleSelectedBattleSelector } from '@/model/battle/selectors';

export function Top() {
	const selectedBattle = useSelector(battleSelectedBattleSelector);

	if (!selectedBattle?.top?.length) {
		return null;
	}

	return (
		<div className={'flex flex-col items-center'}>
			<span className={'mb-[10px] block text-lg font-semibold'}>
				Top of the day
			</span>
			<div className={'flex w-full flex-col gap-y-[5px]'}>
				{selectedBattle?.top?.map((topItem, index) => (
					<TopCard {...topItem} place={index + 1} key={index} />
				))}
			</div>
		</div>
	);
}

export type TopCardProps = TopType & {
	place: number;
};

export function TopCard({
	like_count,
	place,
	username,
	first_name,
}: TopCardProps) {
	return (
		<div
			className={
				'flex w-full items-center justify-between rounded-[10px] bg-[#205295] px-[15px] py-[6px]'
			}
		>
			<div className={'flex items-center justify-start'}>
				<div className={'mr-[5px] block w-[20px] text-sm'}>{place}</div>
				<div
					className={
						'mr-[5px] w-[90px] overflow-hidden overflow-ellipsis whitespace-nowrap text-sm'
					}
				>
					{first_name}
				</div>
				<div className={'flex flex-row items-center gap-x-[5px] text-sm'}>
					<img width={17} src={'/assets/icons/like.svg'} />
					<span className={'text-sm'}>{like_count}</span>
				</div>
			</div>
			<div className={'text-sm font-semibold text-[#42C2FF]'}>{place}</div>
		</div>
	);
}
