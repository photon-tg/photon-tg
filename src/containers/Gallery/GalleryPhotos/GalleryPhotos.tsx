import ArrowLeft from '@/../public/assets/icons/Photo/arrow-left.svg';
import Calendar from '@/../public/assets/icons/calendar.svg';
import { Money } from '@/components/Money/Money';
import { Level, levelToPhotoReward } from '@/constants';
import { formatDate } from '@/utils/date';
import {
	PHOTOS_PER_PAGE,
	useGalleryPhotos,
} from '@/containers/Gallery/GalleryPhotos/useGalleryPhotos';
import { BattlePhotoFragment } from '@/gql/graphql';
import { MyStats } from '@/containers/Battle/LeaderBoard/Statistics/MyStats';

export interface GalleryPhotosProps {
	photos: BattlePhotoFragment[];
}
export function GalleryPhotos(props: GalleryPhotosProps) {
	const { photos } = props;

	const {
		page,
		totalPages,
		selectedImage,
		changeSelectedImage,
		toNext,
		toPrev,
		hasPrevPage,
		hasNextPage,
	} = useGalleryPhotos(photos);
	const galleryStart = page * PHOTOS_PER_PAGE;
	const galleryEnd = galleryStart + PHOTOS_PER_PAGE;

	return (
		<div className={'h-[434px]'}>
			{/* container [selected image + all images] */}
			<div
				className={
					'mb-[15px] grid grid-rows-[min-content_min-content] gap-y-[10px]'
				}
			>
				{/* selected image */}
				<div className={'relative max-h-[280px]'}>
					{/*arrows*/}
					{hasPrevPage && (
						<button
							onClick={toPrev}
							className={'absolute left-[-15px] top-[50%] translate-y-[-50%]'}
						>
							<ArrowLeft />
						</button>
					)}
					{hasNextPage && (
						<button
							onClick={toNext}
							className={
								'absolute right-[-15px] top-[50%] translate-y-[-50%] rotate-180'
							}
						>
							<ArrowLeft />
						</button>
					)}
					<SelectedImage selectedImage={selectedImage} />
				</div>
				{/* all images */}
				<div
					className={
						'grid grid-cols-[minmax(55px,max-content)_minmax(55px,max-content)_minmax(55px,max-content)_minmax(55px,max-content)] justify-between gap-x-[5px] gap-y-[7px]'
					}
				>
					{photos.slice(galleryStart, galleryEnd).map(({ photo_url, id }) => (
						<div key={id} className={'relative'}>
							<img
								onClick={() => changeSelectedImage(id)}
								className={`h-[70px] w-[68px] rounded object-cover ${selectedImage.id === id ? 'opacity-100' : 'opacity-50'}`}
								src={photo_url}
								alt={''}
							/>
							<img
								className={'absolute right-[5px] top-[5px]'}
								width={12}
								height={12}
								src={'/assets/icons/photon.svg'}
							/>
						</div>
					))}
				</div>
			</div>
			{/* containers counter */}
			<span className={'block text-center text-sm'}>
				Page {page + 1} / {totalPages}
			</span>
		</div>
	);
}

interface SelectedImageProps {
	selectedImage: BattlePhotoFragment;
}

export function SelectedImage(props: SelectedImageProps) {
	const { selectedImage } = props;

	if (selectedImage.battle_id) {
		return (
			<div
				className={'grid max-h-[280px] grid-cols-2 rounded-[10px] bg-[#205295]'}
			>
				<img
					className={
						'h-[280px] rounded-bl-[10px] rounded-tl-[10px] object-cover'
					}
					src={selectedImage?.photo_url}
				/>
				<MyStats />
			</div>
		);
	}

	return (
		<div className={'relative h-[280px]'}>
			<img
				className={'h-[280px] w-full rounded object-cover'}
				src={selectedImage.photo_url}
				alt={''}
			/>
			<div
				className={
					'absolute bottom-[10px] right-[10px] flex items-center gap-x-[10px] rounded bg-dark-blue px-[10px] py-[5px]'
				}
			>
				<Money
					amount={
						levelToPhotoReward.get(selectedImage.user_level as Level) as number
					}
				/>
				<div className={'flex items-center gap-x-[5px] text-md'}>
					<Calendar width={18} height={18} />{' '}
					{formatDate(new Date(selectedImage.created_at))}
				</div>
			</div>
		</div>
	);
}
