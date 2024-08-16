import { supabase } from '@/api/supabase';
import { parsePhotos } from '@/api/photos/parsers';
import { nanoid } from 'nanoid';
import { decode } from 'base64-arraybuffer';

export const photosApi = {
  async getBatch(userId: string) {
    const { error, data } = await supabase.storage
      .from('photos')
      .list(`${userId}`, {
        offset: 0,
        limit: 50,
      });

    if (error) {
      throw new Error('Error while fetching photos');
    }

    return data?.length ? data : [];
  },
  async uploadPhoto(userId: string, imageBase64: string) {
    const image = imageBase64.split('base64,')[1];
    const { error, data } = await supabase.storage
      .from('photos')
      .upload(`${userId}/${nanoid()}`, decode(image), {
        contentType: 'image/jpeg',
      });
    console.log(error, data);
  },
} as const;
