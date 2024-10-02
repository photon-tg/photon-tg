'use client';

import { Button } from '@/components/Button/Button';
import { useSelector } from 'react-redux';
import { userPhotosUploadingSelector } from '@/model/user/selectors';

export interface PhotoReviewProps {
	image: string;
	onReject(): void;
	onAccept(): void;
}

export function PhotoReview(props: PhotoReviewProps) {
	const { image, onAccept, onReject } = props;
	const isPhotoUploading = useSelector(userPhotosUploadingSelector);

	return (
		<div className={'grid h-full grid-rows-[1fr_min-content]'}>
			<img className={''} src={image} alt={''} />
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
