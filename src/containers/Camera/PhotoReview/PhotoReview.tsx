'use client';

import { Button } from '@/components/Button/Button';
import { useSelector } from 'react-redux';
import { userPhotosUploadingSelector } from '@/model/user/selectors';
import ArrowIcon from '@/../public/assets/icons/Photo/arrow-left.svg';
import { useCamera } from '@/containers/Camera/useCamera';
import { BattleBanner } from '@/containers/Battle/BattleBanner';

export interface PhotoReviewProps {
	image: string;
	onReject(): void;
	onAccept(): void;
}

export function PhotoReview(props: PhotoReviewProps) {
	const { image, onAccept, onReject } = props;
	const isPhotoUploading = useSelector(userPhotosUploadingSelector);
	const { goBack } = useCamera();

	return (
		<div
			className={'relative grid h-full grid-rows-[1fr_min-content] bg-[black]'}
		>
			<button
				onClick={goBack}
				className={'absolute left-[10px] top-[10px] z-10'}
			>
				<ArrowIcon />
			</button>
			<div className={'absolute top-[40px] z-[700] px-[10px]'}>
				<BattleBanner noTime />
			</div>
			<img
				className={'absolute left-[50%] top-[50%] rounded-[10px]'}
				style={{
					transform:
						'translateX(-50%) translateY(-50%) translateY(-35px) scale(0.75)',
				}}
				src={image}
				alt={''}
			/>
			<div
				className={
					'absolute bottom-0 flex w-full justify-between gap-x-[10px] px-[20px] pb-[25px]'
				}
			>
				<Button
					disabled={isPhotoUploading}
					onClick={onReject}
					variant={'outline'}
					size={'sm'}
					height={60}
				>
					Redo
				</Button>
				<Button
					disabled={isPhotoUploading}
					onClick={onAccept}
					variant={'outline'}
					size={'sm'}
					height={60}
				>
					<span className={'text-[13px]'}>Send to battle</span>
				</Button>
			</div>
		</div>
	);
}
