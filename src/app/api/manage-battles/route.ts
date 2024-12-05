import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;

export async function GET(request: Request) {
	try {
		if (process.env.NODE_ENV === 'development') return new Response('No local');

		const authHeader = request.headers.get('auth');

		if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
			return new Response('Unauthorized', {
				status: 401,
			});
		}

		const supabase = createClient(
			process.env.NEXT_PUBLIC_SUPABASE_URL!,
			process.env.SUPABASE_SERVICE_ROLE_KEY!,
		);

		const { data, error } = await supabase
			.from('battles')
			.select('*')
			.eq('is_active', true)
			.in('stage', ['join', 'join_vote', 'vote'])
			.order('start_date', { ascending: true });

		if (error) {
			throw new Error('Error')
		}

		const battles = (data as { stage: string; id: string }[]);

		const joinBattle = battles?.find(({ stage }) => stage === 'join');
		const joinAndVoteBattle = battles?.find(({ stage }) => stage === 'join_vote');
		const voteBattle = battles?.find(({ stage }) => stage === 'vote');

		if (joinBattle) {
			await supabase
				.from('battles')
				.update({ stage: 'join_vote' })
				.eq('id', joinBattle.id);
		}

		if (joinAndVoteBattle) {
			await supabase
				.from('battles')
				.update({ stage: 'vote' })
				.eq('id', joinAndVoteBattle.id);

			await supabase
				.from('battles')
				.insert({ stage: 'join', is_active: true });
		}

		if (voteBattle) {
			await supabase
				.from('battles')
				.update({ stage: 'finish', is_active: false })
				.eq('id', voteBattle.id);
		}

		return new Response(JSON.stringify('OK'));
	} catch (err) {
		return new Response(JSON.stringify('Error'));
	}
}
