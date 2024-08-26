import { axiosInstance } from '@/api/axios';
import { AxiosResponse } from 'axios';
import { supabase } from '@/api/supabase';

const mockData = process.env.NEXT_PUBLIC_MOCK_TG_DATA;

export const authApi = {
  async authenticate(): Promise<any> {
    const { data }: AxiosResponse<any> = await axiosInstance.post<any>(
      '/check-telegram-data',
      {
        dataCheckString:
          process.env.NODE_ENV === 'development'
            ? mockData
            : window?.Telegram?.WebApp.initData,
      },
    );

    const { user, referrerId, ...rest } = data || {};

    if (!user) {
      return 'bad user';
    }

    const signUpResult = await supabase.auth.signUp({
      email: `${user.id}@photon.com`,
      password: `${user.id}`,
    });

    // user already registered
    if (signUpResult.error?.status === 422) {
      const signUpResult = await supabase.auth.signInWithPassword({
        email: `${user.id}@photon.com`,
        password: `${user.id}`,
      });
      console.log(rest, 'ddd');
      return {
        ...signUpResult.data?.user,
        telegram: {
          firstName: user?.first_name,
          lastName: user?.last_name,
          username: user?.username,
        },
        referrerId,
      };
    }

    // TODO: fixfix
    return '';
  },
  async getUser(userId: string) {
    const { data, error } = await supabase
      .from('users')
      .select()
      .eq('id', userId);

    if (error) {
      // TODO: handle
      throw new Error();
    }

    return data?.[0];
  },
} as const;
