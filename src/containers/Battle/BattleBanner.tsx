import { useSelector } from 'react-redux';
import { translationsCurrentBattleSelect } from '@/model/translations/selectors';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { battleCurrentBattleSelector } from '@/model/battle/selectors';
import { BattleContent } from '@/model/translations/types';

export interface BattleBannerProps {
	noTime?: boolean;
}

export function BattleBanner(props: BattleBannerProps) {
	const { noTime = false } = props;
	const translation = useSelector(
		translationsCurrentBattleSelect,
	) as BattleContent;
	const currentBattle = useSelector(battleCurrentBattleSelector);
	const getTimeLeftForVoting = (): {
		formattedHours: string;
		formattedMinutes: string;
	} => {
		const now = new Date();

		// Calculate the difference in milliseconds
		const timeDiff =
			new Date(currentBattle?.end_date ?? '').getTime() - now.getTime();

		// If the time difference is negative, it means the end date has passed
		if (timeDiff <= 0) {
			return { formattedHours: '0', formattedMinutes: '0' };
		}

		// Convert the time difference from milliseconds to minutes
		const totalMinutes = Math.floor(timeDiff / (1000 * 60));

		// Calculate hours and remaining minutes
		const hours = Math.floor(totalMinutes / 60);
		const minutes = totalMinutes % 60;

		// Format hours and minutes as hh:mm
		const formattedHours = hours.toString();
		const formattedMinutes = minutes.toString();

		return { formattedHours, formattedMinutes };
	};

	const { formattedHours, formattedMinutes } = getTimeLeftForVoting();

	return (
		<div
			className={
				'flex flex-col justify-center rounded-[10px] bg-[#205295] px-[10px] py-[10px] text-center'
			}
		>
			<span className={'mb-[10px] text-lg font-semibold'}>
				{translation?.title}
			</span>
			<div className={'font-regular mb-[5px] text-sm'}>
				{documentToReactComponents(translation?.description as any)}
			</div>
			{!noTime && (
				<div className={'text-sm font-semibold text-[#488ae5]'}>
					Time left for voting {formattedHours}hrs {formattedMinutes}min
				</div>
			)}
		</div>
	);
}
