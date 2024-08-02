"use client";

import {PHOTOS_PER_PAGE, useGalleryPhotos} from "@/containers/Gallery/GalleryPhotos/useGalleryPhotos";
import ArrowLeft from "@/../public/assets/icons/Photo/arrow-left.svg";
import {Photo} from "@/api/photos/parsers";
import {photosBucketURL} from "@/api/supabase";


export interface GalleryPhotosProps {
  photos: Photo[];
}
export function GalleryPhotos(props: GalleryPhotosProps) {
  const { photos } = props;

  const { page, totalPages, selectedImage, changeSelectedImage, toNext, toPrev, hasPrevPage, hasNextPage } =
    useGalleryPhotos(photos);

  const galleryStart = page * PHOTOS_PER_PAGE;
  const galleryEnd = galleryStart + PHOTOS_PER_PAGE

  return (
    <div className={"h-[434px]"}>
      {/* container [selected image + all images] */}
      <div
        className={
          "mb-[15px] grid grid-rows-[min-content_min-content] gap-y-[10px]"
        }
      >
        {/* selected image */}
        <div className={"relative"}>
          {/*arrows*/}
          {hasPrevPage && (
            <button
              onClick={toPrev}
              className={"absolute left-[-15px] top-[50%] translate-y-[-50%]"}
            >
              <ArrowLeft/>
            </button>
          )}
          {hasNextPage && (
            <button
              onClick={toNext}
              className={
                "absolute right-[-15px] top-[50%] translate-y-[-50%] rotate-180"
              }
            >
              <ArrowLeft/>
            </button>
          )}
          <img
            className={"h-[280px] w-full rounded object-cover"}
            src={`${photosBucketURL}/${selectedImage.name}`}
            alt={""}
          />
        </div>
        {/* all images */}
        <div
          className={
            "grid grid-cols-[minmax(55px,max-content)_minmax(55px,max-content)_minmax(55px,max-content)_minmax(55px,max-content)] justify-between gap-x-[5px] gap-y-[7px]"
          }
        >
          {photos.slice(galleryStart, galleryEnd).map(({ name, id }) => (
            <img
              onClick={() => changeSelectedImage(id)}
              key={id}
              className={`h-[70px] w-[68px] rounded object-cover ${selectedImage.id === id ? 'opacity-100' : 'opacity-50'}`}
              src={`${photosBucketURL}/${name}`}
              alt={""}
            />
          ))}
        </div>
      </div>
      {/* pages counter */}
      <span className={"block text-center text-sm"}>
        Page {page + 1} / {totalPages}
      </span>
    </div>
  );
}
