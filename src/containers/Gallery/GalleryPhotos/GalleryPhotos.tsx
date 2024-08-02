"use client";

import { useGalleryPhotos } from "@/containers/Gallery/GalleryPhotos/useGalleryPhotos";
import ArrowLeft from "@/../public/assets/icons/Photo/arrow-left.svg";

export function GalleryPhotos() {
  const { page, totalPages, selectedImage, setSelectedImage, toNext, toPrev } =
    useGalleryPhotos();

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
          <button
            onClick={toPrev}
            className={"absolute left-[-15px] top-[50%] translate-y-[-50%]"}
          >
            <ArrowLeft />
          </button>
          <button
            onClick={toNext}
            className={
              "absolute right-[-15px] top-[50%] translate-y-[-50%] rotate-180"
            }
          >
            <ArrowLeft />
          </button>
          <img
            className={"h-[280px] w-full rounded object-cover"}
            src={"/assets/icons/test.png"}
            alt={""}
          />
        </div>
        {/* all images */}
        <div
          className={
            "grid grid-cols-[minmax(55px,max-content)_minmax(55px,max-content)_minmax(55px,max-content)_minmax(55px,max-content)] justify-between gap-x-[5px] gap-y-[7px]"
          }
        >
          {Array.from({ length: 8 }, (_, i) => (
            <img
              key={i}
              className={"h-au w-[68px] rounded object-cover"}
              src={"/assets/icons/test.png"}
              alt={""}
            />
          ))}
        </div>
      </div>
      {/* pages counter */}
      <span className={"block text-center text-sm"}>
        Page {page} / {totalPages}
      </span>
    </div>
  );
}
