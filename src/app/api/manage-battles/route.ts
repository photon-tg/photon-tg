import { createClient } from '@supabase/supabase-js';
import { minutesSinceUTCDate } from '@/utils/date';

const TWELVE_HOURS = 720;
const TWENTY_FOUR_HOURS = 1440;
const THIRTY_SIX_HOURS = 2160;

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;

export async function GET(request: Request) {
	try {
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

		const { data: activeBattles, error: activeBattlesError } = await supabase
			.from('battles')
			.select('*')
			.eq('is_active', true)
			.order('start_date', { ascending: true });

		if (activeBattlesError) {
			console.error(
				'Error fetching ACTIVE battles:',
				activeBattlesError.message,
			);
			return;
		}

		const [firstBattle, secondBattle] = activeBattles || [];

		if (activeBattles?.length < 1) {
			throw new Error('no active battles');
		}

		const isFirstBattle36HoursIn =
			minutesSinceUTCDate(firstBattle.start_date) >= THIRTY_SIX_HOURS;
		const isFirstBattle24HoursIn =
			minutesSinceUTCDate(firstBattle.start_date) >= TWENTY_FOUR_HOURS;
		const isFirstBattle12HoursIn =
			minutesSinceUTCDate(firstBattle.start_date) >= TWELVE_HOURS;

		if (firstBattle.stage === 'vote' && isFirstBattle36HoursIn) {
			/** Need to change stage to 'finish' */
			const response = await supabase
				.from('battles')
				.update({ stage: 'finish', is_active: false })
				.eq('id', firstBattle.id);

			if (response.error) {
				console.error(response);
			}
		}

		if (firstBattle.stage === 'join_vote' && isFirstBattle24HoursIn) {
			/** Need to change stage to 'vote' */
			const response = await supabase
				.from('battles')
				.update({ stage: 'vote' })
				.eq('id', firstBattle.id);

			if (response.error) {
				console.error(response);
			}
		}

		if (firstBattle.stage === 'join' && isFirstBattle12HoursIn) {
			/** Need to change stage to 'join_vote' */
			const response = await supabase
				.from('battles')
				.update({ stage: 'join_vote' })
				.eq('id', firstBattle.id);

			if (response.error) {
				console.error(response);
			}
		}

		if (!secondBattle && isFirstBattle24HoursIn) {
			/** Need to create next battle */
			const response = await supabase
				.from('battles')
				.insert({ stage: 'join', is_active: true });

			if (response.error) {
				console.error(response);
			}

			return new Response('ok');
		}

		if (!secondBattle) {
			return new Response('ok');
		}

		const isSecondBattle12HoursIn =
			minutesSinceUTCDate(secondBattle.start_date) >= TWELVE_HOURS;
		const isSecondBattle24HoursIn =
			minutesSinceUTCDate(secondBattle.start_date) >= TWENTY_FOUR_HOURS;

		if (secondBattle.stage === 'join_vote' && isSecondBattle24HoursIn) {
			/** Need to change stage to 'vote' */
			const response = await supabase
				.from('battles')
				.update({ stage: 'vote' })
				.eq('id', secondBattle.id);

			if (response.error) {
				console.error(response);
			}
		}

		if (secondBattle.stage === 'join' && isSecondBattle12HoursIn) {
			/** Need to change stage to 'join_vote' */
			const response = await supabase
				.from('battles')
				.update({ stage: 'join_vote' })
				.eq('id', secondBattle.id);

			if (response.error) {
				console.error(response);
			}
		}
	} catch (err) {
		return new Response(JSON.stringify('err'));
	}

	return new Response(JSON.stringify('ok'));
}
