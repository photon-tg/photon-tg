'use client';

import { useState } from 'react';
import { useApplicationContext } from '@/contexts/ApplicationContext/ApplicationContext';

export function Tap() {
	const { coins, maxEnergy, energy, onTap } = useApplicationContext();

	return (
		<div className={'flex h-full items-center justify-center'}>
			<div
				className={
					'grid-rows-[repeat(3, min-content)] grid items-center justify-center gap-y-[15px]'
				}
			>
				<span
					className={
						'flex items-center gap-x-[10px] justify-self-center text-xxl'
					}
				>
					<img width={40} height={40} src={'/assets/icons/photon.svg'} />
					{coins}
				</span>
				<TapArea onTap={onTap} />
				<div className={'flex items-center justify-center gap-x-[10px]'}>
					<img className={'w-[10px]'} src={'/assets/icons/energy.svg'} />
					{energy} / {maxEnergy}
				</div>
			</div>
		</div>
	);
}

export interface TapAreaProps {
	onTap(): void;
}

function TapArea(props: TapAreaProps) {
	const { onTap } = props;

	const [isPressed, setIsPressed] = useState(false);

	const onTouchStart = () => {
		window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
		setIsPressed(true);
	};

	const onTouchEnd = () => {
		setIsPressed(false);
		onTap();
	};

	return (
		<button
			onTouchStart={onTouchStart}
			onTouchEnd={onTouchEnd}
			className={
			'select-none h-[300px] w-[300px] rounded-[50%] bg-gradient-to-b from-[#5EB3DC] from-0% via-[#11419B] via-50% to-[#0F3F99] to-100% px-[12px] py-[12px] shadow-[0_0_93px_5px_rgba(8,74,199,0.45)]'
			}
		>
			<div
				className={`flex h-full w-full items-center justify-center rounded-[50%] ${isPressed ? 'bg-[#041530]' : 'bg-[#07224c]'}`}
			>
				<img className={'w-[80%]'} src={'/assets/camera-big.png'} />
			</div>
		</button>
	);
}
