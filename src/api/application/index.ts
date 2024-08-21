import { Task } from '@/interfaces/Task';
import { supabase } from '../supabase';

class ApplicationApi {
  public async getConfig() {
    const tasks = await this.getTasks();

    return { tasks };
  };

  public async getTasks(): Promise<Task[] | null> {
    const { data, error } = await supabase.from('tasks').select(`*,
    image (
      url,
      compressed_url
    )
  `);

    if (error) {
      return null;
    }
    console.log(data, 'data')
    return data;
  }
};

export const applicationApi = new ApplicationApi();
