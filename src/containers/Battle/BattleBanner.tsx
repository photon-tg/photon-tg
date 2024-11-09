import { useSelector } from 'react-redux';
import {
	translationsActiveJoinBattleSelector,
	translationsActiveVoteBattleSelector
} from '@/model/translations/selectors';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { battleTimeLeftToVoteSelector } from '@/model/battle/selectors';
import { BattleContent } from '@/model/translations/types';

export interface BattleBannerProps {
	noTime?: boolean;
}

export function BattleBanner(props: BattleBannerProps) {
	const { noTime = false } = props;
	// fixiififififiixifxii
	const translation = useSelector(
		translationsActiveJoinBattleSelector,
	) as BattleContent;
	const timeLeftToVote = useSelector(battleTimeLeftToVoteSelector);

	const { formattedHours, formattedMinutes } = timeLeftToVote || {};

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
