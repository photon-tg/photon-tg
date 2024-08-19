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
  async sync(userId: string, payload: UserSyncPayload) {
    // TODO: filter, etc.
    const { error, data } = await supabase.from('users').update(payload).eq('id', userId);

    if (error) {
      // TODO: handle this
    }
  }
} as const;

export interface UserSyncPayload {
  energy?: number;
  coins?: number;
}
