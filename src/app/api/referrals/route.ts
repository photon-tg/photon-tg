import { createClient } from '@supabase/supabase-js';

// TODO: make this a special user
const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL!,
	process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export async function GET(request: Request) {
	const url = new URL(request.url);
	const searchParams = url.searchParams;
	const referralsIds = searchParams.get('referrals');

	if (!referralsIds) {
		return new Response('bad request', {
			status: 400,
		});
	}

	const telegramIds: string[] = referralsIds.split(',');
	const emails = telegramIds.map((id) => `${id}@photon.com`);

	const { error: signInError } = await supabase.auth.signInWithPassword({
		email: 'edge-functions@photon.com',
		password: 'redound_chapbook_HOYDEN_rye_begotten_plump_passband',
	});

	if (signInError) {
		return new Response('Error', {
			status: 500,
		});
	}

	const { error, data } = await supabase.from('users').select('coins,first_name,last_name').in('email', emails);

	if (error) {
		return new Response('Error', {
			status: 500,
		});
	}
	console.log(error, data);

	return new Response(JSON.stringify(data), {
		status: 200,
	});
}
