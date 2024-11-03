'use client';

import { useCamera } from './useCamera';
import CameraSwitch from '@/../public/assets/icons/cameraswitch.svg';
import ArrowIcon from '@/../public/assets/icons/Photo/arrow-left.svg';
import { isDateTodayUTC } from '@/utils/date';
import { Button } from '@/components/Button/Button';
import { useRouter } from 'next/navigation';
import Webcam from 'react-webcam';
import { Layout } from '@/components/Layout/Layout';
import { useSelector } from 'react-redux';
import { userSelector } from '@/model/user/selectors';
import { useEffect, useState } from 'react';
import { PhotoReview } from '@/containers/Camera/PhotoReview/PhotoReview';
import { BattleBanner } from '@/containers/Battle/BattleBanner';

export function Camera() {
	const router = useRouter();
	const user = useSelector(userSelector);
	const {
		cameraRef,
		takePhoto,
		flip,
		facingMode,
		image,
		onReject,
		onAccept,
		goBack,
	} = useCamera();
	const [isCameraInitialized, setIsCameraInitialized] = useState(false);

	if (user.last_photo && isDateTodayUTC(new Date(user.last_photo))) {
		return (
			<Layout>
				<div className={'absolute top-[50%] w-full translate-y-[-50%]'}>
					<div
						className={
							'mx-auto flex w-full max-w-[280px] flex-col rounded bg-[#062243] px-[30px] py-[24px]'
						}
					>
						<h2 className={'mb-[15px] text-center text-xl'}>
							Wait for tomorrow!
						</h2>
						<div className={'mb-[30px] flex flex-col gap-y-[2px] text-lg'}>
							You can make photos only once a day
						</div>
						<Button
							onClick={() => router.push('/photo/gallery')}
							width={'100%'}
						>
							Return
						</Button>
					</div>
				</div>
			</Layout>
		);
	}

	if (image) {
		return (
			<PhotoReview onReject={onReject} onAccept={onAccept} image={image} />
		);
	}

	return (
		<div className={'relative h-full bg-[#062243]'}>
			<button
				onClick={goBack}
				className={
					'absolute left-[10px] top-[10px] z-[5000] px-[10px] py-[10px]'
				}
			>
				<ArrowIcon />
			</button>
			<div className={'absolute top-[10px] z-[2000] w-full px-[10px]'}>
				<BattleBanner noTime />
			</div>
			<Webcam
				width={'100%'}
				height={'100%'}
				videoConstraints={{
					facingMode,
					aspectRatio: 16 / 9,
				}}
				forceScreenshotSourceSize
				screenshotFormat={'image/jpeg'}
				className={'absolute top-[50%]'}
				screenshotQuality={1}
				imageSmoothing
				mirrored={facingMode === 'user'}
				ref={cameraRef}
				style={{
					transform: 'translateY(-50%) translateY(-35px)',
				}}
				onUserMedia={() => setIsCameraInitialized(true)}
			/>
			<div
				className={
					'absolute bottom-0 left-[50%] z-[300] grid w-full max-w-[375px] translate-x-[-50%] grid-cols-3 justify-items-center pb-[40px]'
				}
			>
				<button />
				<button
					onClick={takePhoto}
					className={
						'flex h-[65px] w-[65px] items-center justify-center self-center rounded-[50%] border-[3px]'
					}
				>
					<span
						className={'block h-[50px] w-[50px] rounded-[50%] bg-[white]'}
					></span>
				</button>
				<button onClick={flip}>
					<CameraSwitch />
				</button>
			</div>
			{isCameraInitialized && (
				<div
					className={'absolute bottom-0 h-[140px] w-full'}
					style={{
						background:
							'linear-gradient(0deg, rgba(15, 27, 56, 100%) 0%, rgba(27, 50, 95, 96%) 55%, rgba(39, 73, 139, 3%) 98%)',
					}}
				></div>
			)}
		</div>
	);
}
