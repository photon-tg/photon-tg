import { axiosInstance } from '@/api/axios';
import { AxiosResponse } from 'axios';
import { supabase } from '@/api/supabase';

import { CheckTelegramDataRT } from '@/app/api/check-telegram-data/route';
import { AuthData } from '@/interfaces/User';

const mockData = process.env.NEXT_PUBLIC_MOCK_TG_DATA;

export const authApi = {
	async authenticate(): Promise<AuthData> {
		const { data }: AxiosResponse<CheckTelegramDataRT & { id: string }> =
			await axiosInstance.post('/check-telegram-data', {
				dataCheckString:
					process.env.NODE_ENV === 'development'
						? mockData
						: window?.Telegram?.WebApp.initData,
			});

		const { user, referrerId } = data ?? {};

		if (!user) {
			throw new Error();
		}

		const credentials = {
			email: `${user.id}@photon.com`,
			password: `${user.id}`,
		};

		const baseResponse: Pick<AuthData, 'telegram' | 'referrerId'> = {
			telegram: user,
			referrerId,
		};

		const signUpResult = await supabase.auth.signUp(credentials);

		if (!signUpResult.error && !!signUpResult.data.user) {
			return {
				...baseResponse,
				id: signUpResult.data.user.id,
			};
		}

		// user already registered
		if (signUpResult.error?.status !== 422) {
			throw new Error();
		}

		const signInResult = await supabase.auth.signInWithPassword(credentials);

		if (signInResult.error || !signInResult.data.user) {
			throw new Error();
		}

		return {
			...baseResponse,
			id: signInResult.data.user.id,
		};
	},
} as const;
