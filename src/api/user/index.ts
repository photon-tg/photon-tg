import { supabase } from '../supabase';

export const userApi = {
	async refer(userId: string, referrerId: string) {
		const { data, error } = await supabase
			.from('users')
			.select('referrals')
			.eq('email', `${referrerId}@photon.com`);

		if (error) {
			// TODO: do some
			throw new Error();
		}

		let referrals = data?.[0]?.referrals || [];

		referrals = [...referrals, userId];

		await supabase
			.from('users')
			.update({ referrals })
			.eq('email', `${referrerId}@photon.com`);
	},
} as const;
