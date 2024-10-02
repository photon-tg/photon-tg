'use client';

import { useCamera } from '@/containers/Camera/useCamera';
import CameraSwitch from '@/../public/assets/icons/cameraswitch.svg';
import ArrowIcon from '@/../public/assets/icons/Photo/arrow-left.svg';
import { PhotoReview } from '@/containers/Camera/PhotoReview/PhotoReview';
import { isDateTodayUTC } from '@/utils/date';
import { Button } from '@/components/Button/Button';
import { useRouter } from 'next/navigation';
import Webcam from 'react-webcam';
import { Layout } from '@/components/Layout/Layout';
import { useSelector } from 'react-redux';
import { userSelector } from '@/model/user/selectors';

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
		<div className={'h-full relative bg-[black]'}>
			<button
				onClick={goBack}
				className={'absolute left-[20px] top-[20px] z-10'}
			>
				<ArrowIcon />
			</button>
			<Webcam
				width={'100%'}
				height={'100%'}
				videoConstraints={{
					facingMode,
					aspectRatio: 4/3,
				}}
				forceScreenshotSourceSize
				screenshotFormat={'image/jpeg'}
				// style={{ objectFit: 'cover', height: '100%' }}
				className={'absolute top-[50%]'}
				screenshotQuality={1}
				imageSmoothing
				mirrored={facingMode === 'user'}
				ref={cameraRef}
				style={{
					transform: 'translateY(-50%) translateY(-50px)',
				}}
			/>
			<div
				className={
					'absolute bottom-0 left-[50%] grid w-full max-w-[375px] translate-x-[-50%] grid-cols-3 justify-items-center pb-[40px]'
				}
			>
				<button />
				<button
					onClick={takePhoto}
					className={'h-[65px] w-[65px] self-center rounded-[50%] border-[3px] flex items-center justify-center'}
				><span className={'w-[50px] h-[50px] bg-[white] block rounded-[50%]'}></span></button>
				<button onClick={flip}>
					<CameraSwitch />
				</button>
			</div>
		</div>
	);
}
