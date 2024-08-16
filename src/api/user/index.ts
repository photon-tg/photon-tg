import { supabase } from '../supabase';

export const userApi = {
  async getApplicationData(userId: string) {
    const { error, data } = await supabase
      .from('users')
      .select()
      .eq('id', userId);

    if (error) {
      // deal with it
    }

    return data?.[0];
  },
} as const;
