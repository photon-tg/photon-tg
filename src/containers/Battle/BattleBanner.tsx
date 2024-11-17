import { useSelector } from 'react-redux';

import {
	activeJoinBattleIdSelector,
	activeVoteBattleIdSelector,
	battleTimeLeftToVoteSelector,
} from '@/model/battle/selectors';
import { useContent } from '@/containers/Battle/useContent';
import { useContext } from 'react';
import { AppContext } from '@/contexts/AppContext';

export interface BattleBannerProps {
	noTime?: boolean;
	isJoin?: boolean;
}

export function BattleBanner(props: BattleBannerProps) {
	const { noTime = false, isJoin = false } = props;
	const { battlesContent, lang } = useContext(AppContext);
	const activeVoteBattleId = useSelector(activeVoteBattleIdSelector);
	const activeJoinBattleId = useSelector(activeJoinBattleIdSelector);

	const translationVote = battlesContent.find(
		(c) => c.id === activeVoteBattleId,
	);
	const translationJoin = battlesContent.find(
		(c) => c.id === activeJoinBattleId,
	);

	const timeLeftToVote = useSelector(battleTimeLeftToVoteSelector);
	const translation =
		isJoin || !translationVote ? translationJoin : translationVote;
	const { formattedHours, formattedMinutes } = timeLeftToVote || {};

	const content = useContent();
	return (
		<div
			className={
				'flex flex-col justify-center rounded-[10px] bg-[#205295] px-[10px] py-[10px] text-center'
			}
		>
			<span className={'mb-[10px] text-lg font-semibold'}>
				{translation?.name?.[lang]}
			</span>
			<div className={'font-regular mb-[5px] text-sm'}>
				{translation?.description?.[lang]}
			</div>
			{!noTime && formattedHours && (
				<div className={'text-sm font-semibold text-[#488ae5]'}>
					{content.timeLeftForVoting} {formattedHours}hrs {formattedMinutes}min
				</div>
			)}
		</div>
	);
}
