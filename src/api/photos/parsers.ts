import {FileObject} from "@supabase/storage-js";

export interface Photo {
  name: string;
  id: string;
}

export function parsePhotos(photos: FileObject[]) {
  return photos.map((photo) => ({
    name: photo.name,
    id: photo.id,
  }));
}
