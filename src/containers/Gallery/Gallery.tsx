'use client';

import { EmptyMessage } from '@/containers/Gallery/EmptyMessage/EmptyMessage';
import { GalleryPhotos } from '@/containers/Gallery/GalleryPhotos/GalleryPhotos';

import { UserPhoto } from '@/types/photo';
import { useSelector } from 'react-redux';
import { userPhotosSelector } from '@/model/user/selectors';
import { useEffect } from 'react';

export interface GalleryProps {
	photos: UserPhoto[];
}

export function Gallery() {
	const photos = useSelector(userPhotosSelector);

	return (
		<div
			className={
				'grid h-full grid-rows-[min-content_1fr] gap-y-[15px] px-[30px] pt-[20px]'
			}
		>
			<h1 className={'text-center text-xxl'}>Your gallery</h1>
			<Content photos={photos} />
		</div>
	);
}

function Content(props: GalleryProps) {
	const { photos } = props;
	if (photos.length === 0) {
		return (
			<div className={'h-fit self-center'}>
				<EmptyMessage />
			</div>
		);
	}

	return <GalleryPhotos photos={photos} />;
}
