import { Gallery } from "@/containers/Gallery/Gallery";

import {photosApi} from "@/api/photos";

export default async function Page() {
  const photos = await photosApi.getBatch();

  console.log(photos);
  return <Gallery photos={photos} />;
}
