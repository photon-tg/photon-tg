'use client';

import { Coins } from '@/components/Coins';
import { Energy } from '@/components/Energy';
import { BattleBanner } from '@/containers/Battle/BattleBanner';
import { BattleZone } from '@/containers/Battle/BattleZone';
import { BattleActions } from '@/containers/Battle/BattleActions';
import { useDispatch, useSelector } from 'react-redux';
import {
	battleMessageSelector,
	battlePhotosSelector,
} from '@/model/battle/selectors';
import { BattleEmptyPhotos } from '@/containers/Battle/BattleEmptyPhotos';
import { useState } from 'react';
import { BattleMessage } from '@/containers/Battle/BattleMessage';
import { battleMessageIsShownSet } from '@/model/battle/actions';

export function Battle() {
	const battlePhotos = useSelector(battlePhotosSelector);
	const [firstPhoto, secondPhoto] = battlePhotos;
	const isNoPhotos = !firstPhoto || !secondPhoto;

	const message = useSelector(battleMessageSelector);
	const dispatch = useDispatch();

	return (
		<div className={'px-[10px]'}>
			<div className={'mb-[10px] mt-[10px] flex justify-between gap-x-[25px]'}>
				<Coins />
				<Energy />
			</div>
			<div className={'mb-[15px]'}>
				<BattleBanner />
			</div>
			<div className={'relative'}>
				{message.isShown && (
					<div
						className={
							'absolute left-[50%] top-[50%] z-[500] w-[90%] translate-x-[-50%] translate-y-[-50%]'
						}
					>
						<BattleMessage
							title={message.content?.title}
							description={message.content?.description}
							onClose={() => dispatch(battleMessageIsShownSet(false))}
						/>
					</div>
				)}
				{!isNoPhotos && (
					<div className={'mb-[10px]'}>
						<BattleZone />
					</div>
				)}
				{isNoPhotos && (
					<div className={'mb-[10px]'}>
						<BattleEmptyPhotos />
					</div>
				)}
			</div>
			<BattleActions />
		</div>
	);
}
