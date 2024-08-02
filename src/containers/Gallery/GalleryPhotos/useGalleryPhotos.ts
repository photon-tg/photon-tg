import { useCallback, useState } from "react";

export function useGalleryPhotos() {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(2);
  const [selectedImage, setSelectedImage] = useState(null);

  const toPrev = useCallback(() => {
    setPage((prevPage) => prevPage - 1);
  }, []);

  const toNext = useCallback(() => {
    setPage((prevPage) => prevPage + 1);
  }, []);

  return {
    page,
    totalPages,
    toNext,
    toPrev,
    selectedImage,
    setSelectedImage,
  };
}
