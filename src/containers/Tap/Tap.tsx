'use client';

import { useEffect, useRef, useState } from 'react';
import { userSelector } from '@/model/user/selectors';
import { useDispatch, useSelector } from 'react-redux';
import { getUserLevel, levelToMaxEnergy } from '@/constants';
import { cn } from '@/utils/cn';
import { operationTap } from '@/model/user/operations/operationTap';

export function Tap() {
	const dispatch = useDispatch();
	const user = useSelector(userSelector);
	return (
		<div
			onSelectCapture={(e) => {
				e.preventDefault();
			}}
			className={'flex h-full items-center justify-center'}
		>
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
					{user.coins}
				</span>
				<TapArea
					isDisabled={user.energy === 0}
					onTap={() => {
						dispatch(operationTap());
					}}
				/>
				<div className={'flex items-center justify-center gap-x-[10px]'}>
					<img className={'w-[10px]'} src={'/assets/icons/energy.svg'} />
					{user.energy} / {levelToMaxEnergy.get(getUserLevel(user.coins))}
				</div>
			</div>
		</div>
	);
}

export interface TapAreaProps {
	onTap(): void;
	isDisabled: boolean;
}

function TapArea(props: TapAreaProps) {
	const { onTap, isDisabled } = props;

	const [isPressed, setIsPressed] = useState(false);
	const tapAreaRef = useRef<HTMLButtonElement>(null);

	useEffect(() => {
		if (tapAreaRef.current) {
			tapAreaRef.current.addEventListener(
				'touchmove',
				(event) => event.preventDefault(),
				{ passive: false },
			);
			tapAreaRef.current.addEventListener('touchstart', (e) =>
				e.preventDefault(),
			);
		}
	}, []);

	const onTouchStart = () => {
		if (isDisabled) return;
		window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
		setIsPressed(true);
	};

	const onTouchEnd = () => {
		if (isDisabled) return;
		setIsPressed(false);
		onTap();
	};

	return (
		<button
			ref={tapAreaRef}
			onTouchStart={onTouchStart}
			onTouchEnd={onTouchEnd}
		>
			<div
				className={cn(
					'pointer-events-none h-[300px] w-[300px] select-none rounded-[50%] px-[12px] py-[12px] shadow-[0_0_93px_5px_rgba(8,74,199,0.45)]',
					!isDisabled &&
						'bg-gradient-to-b from-[#5EB3DC] from-0% via-[#11419B] via-50% to-[#0F3F99] to-100%',
					isDisabled && 'bg-[#081f44]',
				)}
			>
				<div
					className={`pointer-events-none flex h-full w-full items-center justify-center rounded-[50%] ${isPressed ? 'bg-[#072047]' : 'bg-[#07224c]'}`}
				>
					<img
						unselectable={'on'}
						style={{
							scale: isPressed ? '1.03' : '1',
						}}
						className={'pointer-events-none w-[80%] select-none'}
						src={'/assets/camera-big.png'}
					/>
				</div>
			</div>
		</button>
	);
}
