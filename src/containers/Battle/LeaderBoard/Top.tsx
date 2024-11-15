import { useSelector } from 'react-redux';
import { Top as TopType } from '@/model/battle/types';
import { battleSelectedBattleSelector } from '@/model/battle/selectors';
import { cn } from '@/utils/cn';
import { useContent } from '@/containers/Battle/useContent';

export function Top() {
	const selectedBattle = useSelector(battleSelectedBattleSelector);
	const content = useContent();
	if (!selectedBattle?.top?.length) {
		return null;
	}

	return (
		<div className={'flex max-h-[100px] flex-col items-center'}>
			<span className={'mb-[10px] block text-lg font-semibold'}>
				{content.topOfTheDay}
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
	photo_id,
}: TopCardProps) {
	const selectedBattle = useSelector(battleSelectedBattleSelector);

	return (
		<div
			className={cn(
				'flex w-full items-center justify-between rounded-[10px] bg-[#205295] px-[15px] py-[6px]',
				selectedBattle?.userPhoto?.id === photo_id.toString() && 'bg-[#4694ff]',
			)}
		>
			<div className={'flex items-center justify-start'}>
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
			</div>
			{place <= 3 && (
				<div className={'flex w-[30px] items-center justify-start gap-[5px]'}>
					<img width={17} src={'/assets/icons/crown.svg'} />
					<div className={'text-sm font-semibold text-[#42C2FF]'}>{place}</div>
				</div>
			)}
		</div>
	);
}
