import { Task } from '@/interfaces/Task';
import { supabase } from '../supabase';
import { getIsDailyRewardClaimed } from '@/contexts/ApplicationContext/utils';
import { User } from '@/interfaces/User';
import { isDateTodayUTC } from '@/utils/date';

class ApplicationApi {
  public async getConfig(user: User | null) {
    const tasks = await this.getTasks(user);

    return { tasks };
  };

  public async getTasks(user: User | null): Promise<Task[] | null> {
    const { data, error } = await supabase.from('tasks').select(`*,
    image (
      url,
      compressed_url
    )
  `);

    if (error) {
      return null;
    }

    const { data: uData, error: uError } = await supabase.from('user_tasks').select('*').eq('user_id', user?.id);
    return data.map((task) => {
      const uTask = uData?.find(({task_id}) => task_id === task.id);
      if (!uTask) {
        return task;
      }
       return {
        ...task,
        isCompleted: uTask.completed,
        daysCompleted: task.type === 'daily_reward' ? uTask.days_completed : undefined,
        isRewardByDayClaimedToday: task.type === 'daily_reward' ? isDateTodayUTC(new Date(user?.last_daily_reward as string)) : undefined
      } as Task;
    });
  }
};

export const applicationApi = new ApplicationApi();
