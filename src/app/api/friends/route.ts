import { createClient } from '@supabase/supabase-js';
import jwt from 'jsonwebtoken';

const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL!,
	process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export async function POST(request: Request) {
	try {
		const authToken = request.headers.get('Authorization');

		if (!authToken) throw new Error('No auth token provided');

		const jwtToken = authToken.split('Bearer ')[1];
		let userData: any;

		try {
			userData = jwt.verify(jwtToken, process.env.JWT_TOKEN!);
		} catch(err) {

		}

		const tgId = await request.json();

		if ((typeof userData === 'string' || !userData?.user_metadata) && !tgId?.telegramId) throw new Error();
		console.log('hello')
		await supabase.auth.signInWithPassword({
			email: 'edge-functions@photon.com',
			password: 'redound_chapbook_HOYDEN_rye_begotten_plump_passband',
		});

		const telegramId = userData?.user_metadata?.telegram_id ?? tgId?.telegramId;

		const userReferralsResponse = await supabase.from('user_referrals')
			.select('referral_id,is_claimed_by_referrer')
			.eq('referrer_id', telegramId);
		if (userReferralsResponse.error) {
			throw '';
		}

		const friends = (userReferralsResponse.data as { referral_id: string, is_claimed_by_referrer: boolean }[]);
		const friendsIds = friends.map(({ referral_id }) => referral_id);

		const usersResponse = await supabase.from('users').select('coins,first_name,last_name,is_premium,telegram_id').in('telegram_id', friendsIds);
		const responseData = (usersResponse.data as { telegram_id: string }[]).map((user) => ({
			...user,
			is_claimed_by_referrer: friends.find((friend) => friend.referral_id === user.telegram_id)?.is_claimed_by_referrer ?? false,
		}));

		return new Response(JSON.stringify(responseData), {
			status: 200,
		});
	} catch(error) {
		let message = 'Error occurred';
		if (error instanceof Error) {
			message = error.message;
		}

		return new Response(message, {
			status: 500,
		})
	}
}
