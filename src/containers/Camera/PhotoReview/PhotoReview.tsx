'use client';

import { Button } from '@/components/Button/Button';
import { useSelector } from 'react-redux';
import { userPhotosUploadingSelector } from '@/model/user/selectors';
import ArrowIcon from '../../../../public/assets/icons/Photo/arrow-left.svg';
import { useCamera } from '@/containers/Camera/useCamera';

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
		<div className={'relative grid h-full grid-rows-[1fr_min-content] bg-[black]'}>
			<button
				onClick={goBack}
				className={'absolute left-[20px] top-[20px] z-10'}
			>
				<ArrowIcon />
			</button>
			<img
				className={'absolute top-[50%]'}
				style={{
					transform: 'translateY(-50%) translateY(-35px)',
				}}
				src={image} alt={''} />
			<div
				className={
					'absolute bottom-0 flex w-full justify-between px-[20px] pb-[25px]'
				}
			>
				<Button
					disabled={isPhotoUploading}
					onClick={onReject}
					variant={'outline'}
				>
					Reject
				</Button>
				<Button
					disabled={isPhotoUploading}
					onClick={onAccept}
					variant={'outline'}
				>
					Accept
				</Button>
			</div>
		</div>
	);
}
