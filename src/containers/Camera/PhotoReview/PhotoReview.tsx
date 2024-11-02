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
			className={'gap-y-[10px] relative grid h-full grid-rows-[min-content_1fr_min-content] bg-[#062243] px-[10px] pt-[20px] items-center justify-center justify-items-center'}
		>
			<button
				onClick={goBack}
				className={'absolute left-[10px] top-[10px] z-10'}
			>
				<ArrowIcon />
			</button>
			<div className={''}>
				<BattleBanner noTime />
			</div>
			<img
				className={'rounded-[10px]'}
				style={{height: 'calc(100vh - 230px)', aspectRatio: '16/9'}}
				src={image}
				alt={''}
			/>
			<div
				className={
					'flex w-full justify-between gap-x-[10px] pb-[25px]'
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
