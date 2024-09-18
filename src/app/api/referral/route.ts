import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL!,
	process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export async function POST(request: Request) {
	try {
		const body = await request.json();
		const telegramId = body.telegramId;
		console.log(telegramId, 'tg');
		if (!telegramId) {
			throw new Error('Not found');
		}

		await supabase.auth.signInWithPassword({
			email: 'edge-functions@photon.com',
			password: 'redound_chapbook_HOYDEN_rye_begotten_plump_passband',
		});

		const usersResponse = await supabase
			.from('users')
			.select('is_premium')
			.eq('telegram_id', telegramId);

		if (usersResponse.error || !usersResponse.data[0]) {
			throw new Error();
		}

		return new Response(JSON.stringify(usersResponse.data[0]), {
			status: 200,
		});
	} catch (err) {
		return new Response('Bad request', { status: 400 });
	}
}
