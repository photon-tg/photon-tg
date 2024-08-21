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
  },
  async refer(userId: string, referrerId: string) {
    const { data, error } = await supabase.from('users').select('referrals').eq('email', `${referrerId}@photon.com`);

    if (error) {
      // TODO: do some
      throw new Error();
    }

    let referrals = data?.[0]?.referrals || [];

    referrals = [...referrals, userId];

    await supabase.from('users').update({ referrals }).eq('email', `${referrerId}@photon.com`);
  }
} as const;

export interface UserSyncPayload {
  energy?: number;
  coins?: number;
}
