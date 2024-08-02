import { EmptyMessage } from "@/containers/Gallery/EmptyMessage/EmptyMessage";
import { GalleryPhotos } from "@/containers/Gallery/GalleryPhotos/GalleryPhotos";
import {Photo} from "@/api/photos/parsers";

export interface GalleryProps {
  photos: Photo[];
}

export function Gallery(props: GalleryProps) {
  return (
    <div
      className={
        "grid h-full grid-rows-[min-content_1fr] gap-y-[15px] px-[30px] pt-[20px]"
      }
    >
      <h1 className={"text-center text-xl"}>Your gallery</h1>
      <Content photos={props.photos} />
    </div>
  );
}

function Content(props: GalleryProps) {
  const { photos } = props;
  if (photos.length === 0) {
    return (
      <div className={"h-fit self-center"}>
        <EmptyMessage />
      </div>
    );
  }

  return <GalleryPhotos photos={photos} />;
}
