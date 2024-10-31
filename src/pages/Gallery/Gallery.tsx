'use client';

import { useSelector } from 'react-redux';
import { userPhotosSelector } from '@/model/user/selectors';
import { EmptyMessage } from '@/pages/Gallery/EmptyMessage/EmptyMessage';
import { GalleryPhotos } from '@/pages/Gallery/GalleryPhotos/GalleryPhotos';
import { BattlePhotoFragment } from '@/gql/graphql';

export interface GalleryProps {
	photos: BattlePhotoFragment[];
}

export function Gallery() {
	const photos = useSelector(userPhotosSelector);
	console.log(photos, 'photos');
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
