import { useDispatch, useSelector } from 'react-redux';
import {
	battleIsAnimatingSelector,
	battlePhotosSelector,
} from '@/model/battle/selectors';
import { operationBattlePhotoSelect } from '@/model/battle/operations/operationBattlePhotoSelect';
import { BattleReward } from '@/containers/Battle/BattleReward';
import { useState } from 'react';
import { motion } from 'framer-motion';
import {
	battleCurrentBattlePhotosRemove,
	battleMessageContentSet,
	battleMessageIsShownSet,
} from '@/model/battle/actions';
import { userCoinsSelector, userEnergySelector } from '@/model/user/selectors';
import { getUserLevel, levelToSelectEnergyReduction } from '@/constants';

export function BattleZone() {
	const battlePhotos = useSelector(battlePhotosSelector);
	const isAnimating = useSelector(battleIsAnimatingSelector);
	const [selectedPhoto, setSelectedPhoto] = useState<string>('');
	const dispatch = useDispatch();
	const userEnergy = useSelector(userEnergySelector);
	const userCoins = useSelector(userCoinsSelector);
	const userLevel = getUserLevel(userCoins);
	const selectEnergyReduction = levelToSelectEnergyReduction.get(userLevel)!;

	const [firstPhoto, secondPhoto] = battlePhotos;

	const onSelect = (selectedPhotoId: string) => {
		if (selectedPhoto) return;
		const energyReduced = userEnergy - selectEnergyReduction;
		if (energyReduced < 0) {
			dispatch(
				battleMessageContentSet({
					title: 'Not enough energy to vote',
					description: 'Wait for some time for it to recover',
				}),
			);
			dispatch(battleMessageIsShownSet(true));
			return;
		}
		dispatch(
			operationBattlePhotoSelect({
				selectedPhotoId,
				otherPhotoId:
					firstPhoto.id === selectedPhotoId ? secondPhoto.id : firstPhoto.id,
			}),
		);
		setSelectedPhoto(selectedPhotoId);

		setTimeout(() => {
			setSelectedPhoto('');
			dispatch(battleCurrentBattlePhotosRemove());
		}, 2000);
	};

	return (
		<div className={'relative grid grid-cols-[1fr_1fr] gap-x-[2px]'}>
			<div
				className={
					'absolute left-[50%] top-[50%] z-[10] flex h-[60px] w-[60px] translate-x-[-50%] translate-y-[-50%] place-content-center rounded-[50%] bg-[#0F1B38]'
				}
			>
				<img width={28} src={'/assets/icons/vs.svg'} />
			</div>
			<motion.div className={'relative'}>
				<img
					onClick={() => onSelect(firstPhoto.id)}
					className={'h-[300px] rounded-[10px] object-cover'}
					src={firstPhoto.photo_url}
				/>
				{selectedPhoto === firstPhoto.id && (
					<BattleReward onFinish={() => setSelectedPhoto('')} />
				)}
			</motion.div>
			<div className={'relative'}>
				<img
					onClick={() => onSelect(secondPhoto.id)}
					className={'h-[300px] rounded-[10px] object-cover'}
					src={secondPhoto.photo_url}
				/>
				{selectedPhoto === secondPhoto.id && (
					<BattleReward onFinish={() => setSelectedPhoto('')} />
				)}
			</div>
		</div>
	);
}
