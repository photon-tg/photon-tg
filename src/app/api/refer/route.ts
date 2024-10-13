import { createClient } from '@supabase/supabase-js';
import { ReferUserPayload } from '@/model/user/services';

const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL!,
	process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

const telegramIdPattern = /^\d{1,32}$/;

export type ReferUserResponse =
	| {
			data: null;
			meta: {
				error: string;
			};
	  }
	| {
			data: {
				isReferrerUser: boolean;
				referrer: string;
			};
			meta: {
				error: null;
			};
	  };

export async function POST(request: Request) {
	try {
		const body: ReferUserPayload = await request.json();
		const { userId, referrer, isPremium } = body || {};

		if (!referrer || !userId) {
			throw new Error('No referrer or no user');
		}

		const isReferrerUser = telegramIdPattern.test(referrer);

		if (isReferrerUser) {
			const referrerUserResponse = await supabase
				.from('users')
				.select('id')
				.eq('telegram_id', referrer);
			const referrerUser = referrerUserResponse.data?.[0];

			if (referrerUserResponse.error || !referrerUser) {
				throw new Error('Failed');
			}

			const addUserReference = supabase.from('user_references').upsert(
				{
					referrer_user_id: referrerUser.id,
					referred_user_id: userId,
					is_referred_premium: isPremium,
				},
				{ onConflict: 'referred_user_id' },
			);

			const addUserFriend = supabase.from('user_friends').upsert(
				{
					user_id: referrerUser.id,
					friend_id: userId,
				},
				{ onConflict: 'user_id,friend_id' },
			);

			await Promise.all([addUserReference, addUserFriend]);

			const response: ReferUserResponse = {
				data: {
					isReferrerUser: true,
					referrer: referrer,
				},
				meta: {
					error: null,
				},
			};

			return new Response(JSON.stringify(response));
		}

		if (!isReferrerUser) {
			await supabase.from('affiliate_references').insert({
				affiliate_code: referrer,
				referred_user_id: userId,
			});

			const response: ReferUserResponse = {
				data: {
					isReferrerUser: false,
					referrer: referrer,
				},
				meta: {
					error: null,
				},
			};

			return new Response(JSON.stringify(response));
		}
	} catch (error) {
		const response: ReferUserResponse = {
			data: null,
			meta: {
				error: error instanceof Error ? error.message : 'Unexpected error',
			},
		};

		return new Response(JSON.stringify(response));
	}

	const response: ReferUserResponse = {
		data: null,
		meta: {
			error: 'Incorrect referrer',
		},
	};

	return new Response(JSON.stringify(response));
}
