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

    if (!data) {
      return 'bad user';
    }

    const signUpResult = await supabase.auth.signUp({
      email: `${data.id}@photon.com`,
      password: `${data.id}`,
    });

    // user already registered
    if (signUpResult.error?.status === 422) {
      const signUpResult = await supabase.auth.signInWithPassword({
        email: `${data.id}@photon.com`,
        password: `${data.id}`,
      });

      return {
        ...signUpResult.data?.user,
        telegram: {
          firstName: data?.first_name,
          lastName: data?.last_name,
          username: data?.username,
        },
      };
    }

    // TODO: fixfix
    return '';
  },
} as const;
