'use client';

import { Button } from '@/components/Button/Button';

export interface PhotoReviewProps {
	image: string;
	onReject(): void;
	onAccept(): void;
}

export function PhotoReview(props: PhotoReviewProps) {
	const { image, onAccept, onReject } = props;

	return (
		<div className={'grid h-full grid-rows-[1fr_min-content]'}>
			<img className={'h-full w-full object-cover'} src={image} alt={''} />
			<div
				className={
					'absolute bottom-0 flex w-full justify-between px-[20px] pb-[25px]'
				}
			>
				<Button onClick={onReject}  variant={'outline'}>Reject</Button>
				<Button onClick={onAccept}  variant={'outline'}>Accept</Button>
			</div>
		</div>
	);
}
