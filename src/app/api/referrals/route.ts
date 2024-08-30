import { createClient } from '@supabase/supabase-js';

// TODO: make this a special user
const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL!,
	process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export async function GET(request: Request) {
	const url = new URL(request.url);
	const searchParams = url.searchParams;
	const referralId = searchParams.get('referral');
	const referrerId = searchParams.get('referrer');

	if (!referralId && !referrerId) {
		return new Response('bad request', {
			status: 400,
		});
	}

	const { error: signInError } = await supabase.auth.signInWithPassword({
		email: 'edge-functions@photon.com',
		password: 'redound_chapbook_HOYDEN_rye_begotten_plump_passband',
	});

	if (signInError) {
		return new Response('Error', {
			status: 500,
		});
	}

	if (referrerId) {
		const { error, data } = await supabase.from('users').select('coins,first_name,last_name,is_premium').eq('telegram_id', referrerId);

		if (error) {
			return new Response('Error', {
				status: 500,
			});
		}

		return new Response(JSON.stringify(data), {
			status: 200,
		});
	}

	if (referralId) {
		const { data: dataR, error: eb } = await supabase.from('user_referrals').select('referral_id,is_claimed_by_referrer').eq('referrer_id', referralId);

		const usersIds = dataR?.map((ref) => ref?.referral_id) ?? [];
		const {
			data
		} = await supabase.from('users').select('coins,first_name,last_name,is_premium').in('telegram_id', usersIds);

		const mod =  data?.map((a) => {
			return {
				...a,
				is_claimed_by_referrer: dataR?.find((b) => b.referralId === a.telegram_id)?.is_claimed_by_referrer ?? false,
			}
		});

		return new Response(JSON.stringify(mod), {
			status: 200,
		});
	}
}
