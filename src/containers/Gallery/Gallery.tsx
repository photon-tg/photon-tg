import { EmptyMessage } from "@/containers/Gallery/EmptyMessage/EmptyMessage";
import { GalleryPhotos } from "@/containers/Gallery/GalleryPhotos/GalleryPhotos";

export function Gallery() {
  return (
    <div
      className={
        "grid h-full grid-rows-[min-content_1fr] gap-y-[15px] px-[30px] pt-[20px]"
      }
    >
      <h1 className={"text-center text-xl"}>Your gallery</h1>
      <Content />
    </div>
  );
}

function Content() {
  if (false) {
    return (
      <div className={"h-fit self-center"}>
        <EmptyMessage />
      </div>
    );
  }

  return <GalleryPhotos />;
}
