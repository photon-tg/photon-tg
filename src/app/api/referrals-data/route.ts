import { createClient } from '@supabase/supabase-js';
import { ReferralData, UserErrorType } from '@/model/user/types';

const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL!,
	process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export type ReferralsDataResponse = {
	error: {
		type: UserErrorType;
		message: string;
	};
} | {
	data: ReferralData[],
	error: null;
}

export async function POST(request: Request) {
	try {
		const requestBody = await request.json();
		const telegramId = requestBody.telegramId;

		if (!telegramId) {
			return new Response(JSON.stringify({ type: '', message: 'Bad request' }), { status: 400 });
		}

		await supabase.auth.signInWithPassword({
			email: 'edge-functions@photon.com',
			password: 'redound_chapbook_HOYDEN_rye_begotten_plump_passband',
		});

		const referralsResponse = await supabase.from('user_referrals')
			.select('referral_id,is_claimed_by_referrer')
			.eq('referrer_id', telegramId);

		if (referralsResponse.error) {
			return new Response(JSON.stringify({ type: UserErrorType.SERVER_ERROR, message: 'Internal server error' }), { status: 500 });
		}

		const referrals = referralsResponse.data;
		const referralsIds = referrals.map(({ referral_id }) => referral_id);

		const usersResponse = await supabase.from('users').select('coins,first_name,last_name,is_premium,telegram_id').in('telegram_id', referralsIds);

		if (usersResponse.error) {
			return new Response(JSON.stringify({ type: UserErrorType.SERVER_ERROR, message: 'Internal server error' }), { status: 500 });
		}

		const referralsData: ReferralData[] = usersResponse.data.map((user) => ({
			...user,
			is_claimed_by_referrer: referrals.find((friend) => friend.referral_id === user.telegram_id)?.is_claimed_by_referrer ?? false,
		}));

		return new Response(JSON.stringify({
			data: referralsData,
			error: null,
		}), { status: 200 });
	} catch(error) {
		return new Response(JSON.stringify({ type: UserErrorType.SERVER_ERROR, message: 'Internal server error' }), { status: 500 });
	}
}
