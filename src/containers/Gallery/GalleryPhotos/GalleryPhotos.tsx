import {
  PHOTOS_PER_PAGE,
  useGalleryPhotos,
} from '@/containers/Gallery/GalleryPhotos/useGalleryPhotos';
import ArrowLeft from '@/../public/assets/icons/Photo/arrow-left.svg';
import Calendar from '@/../public/assets/icons/calendar.svg';
import { useUserContext } from '@/contexts/UserContext';
import { UserPhoto } from '@/interfaces/photo';
import { Money } from '@/components/Money/Money';
import { Level, levelToPhotoReward } from '@/constants';
import { formatDate } from '@/utils/date';

export interface GalleryPhotosProps {
  photos: UserPhoto[];
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
  const { user } = useUserContext();

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
        <div className={'relative'}>
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
					<div className={'relative'}>
						<img
							className={'h-[280px] w-full rounded object-cover'}
							src={selectedImage.url}
							alt={''}
						/>
						<div className={'absolute bottom-[10px] right-[10px] flex gap-x-[10px] items-center bg-dark-blue px-[10px] py-[5px] rounded'}>
							<Money amount={levelToPhotoReward.get(selectedImage.level_at_time as Level) as number} />
							<div className={'text-md flex items-center gap-x-[5px]'}><Calendar /> {formatDate(new Date(selectedImage.created_at))}</div>
						</div>
					</div>
        </div>
        {/* all images */}
        <div
          className={
            'grid grid-cols-[minmax(55px,max-content)_minmax(55px,max-content)_minmax(55px,max-content)_minmax(55px,max-content)] justify-between gap-x-[5px] gap-y-[7px]'
          }
        >
          {photos.slice(galleryStart, galleryEnd).map(({url, id }) => (
						<div key={id} className={'relative'}>
							<img
								onClick={() => changeSelectedImage(id)}
								className={`h-[70px] w-[68px] rounded object-cover ${selectedImage.id === id ? 'opacity-100' : 'opacity-50'}`}
								src={url}
								alt={''}
							/>
							<img
								className={'absolute top-[5px] right-[5px]'}
								width={12}
								height={12}
								src={'/assets/icons/photon.svg'}
							/>
						</div>
					))}
				</div>
			</div>
			{/* pages counter */}
			<span className={'block text-center text-sm'}>
        Page {page + 1} / {totalPages}
      </span>
    </div>
  );
}
