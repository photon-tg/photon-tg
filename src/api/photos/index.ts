import {supabase} from "@/api/supabase";
import {parsePhotos} from "@/api/photos/parsers";

export const photosApi = {
  async getBatch() {
    const { error, data  } = await supabase.storage.from('photos').list('public', {
      offset: 0,
      limit: 50,
    });

    if (error) {
      throw new Error('Error while fetching photos');
    }

    return data?.length ? parsePhotos(data) : [];
  }
} as const;
