import { isDateTodayUTC } from '@/utils/date';
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
  },
  async claimDailyReward(userId: string, taskId: string, userTaskId: string) {
    // We want to check one more time to be sure that a day has elasped
    const { data, error } = await supabase.from('users').select('last_daily_reward').eq('id', userId);
    let userTaskData: any, userTaskError: any;
    if (userTaskId) {
      let { data: userTaskData, error: userTaskError } = await supabase.from('user_tasks').select().eq('id', userTaskId);
    }

    // TODO: case when more than 1 day passed - reset all


    if (error) {
      // TODO: Handle
      throw new Error();
    }

    const lastClaimedReward = data?.[0]?.last_daily_reward;
    const isClaimedToday = lastClaimedReward !== null && isDateTodayUTC(new Date(lastClaimedReward));
    console.log(isClaimedToday, 'isClaimed')
    if (isClaimedToday) {
      return;
    }

    const nowUTC = new Date().toUTCString();

    if (!userTaskData?.[0]) {
      // first time completed this daily reward task

      const { data: insertData, error: insertedError } = await supabase.from('user_tasks').insert({
        user_id: userId,
        task_id: taskId,
        completed: false,
        days_completed: 1,
      });
    } else {
      const isCopmleted = userTaskData?.[0]?.days_completed === 9;
      const { data: insertData, error: insertedError } = await supabase.from('user_tasks').update({ days_completed: userTaskData[0].days_completed + 1, completed: isCopmleted }).eq('id', userTaskId);
    }

    const { data: updateData, error: updateError } = await supabase.from('users').update({ last_daily_reward: nowUTC }).eq('id', userId);

    console.log(updateData, updateError)
  }
} as const;

export interface UserSyncPayload {
  energy?: number;
  coins?: number;
}
