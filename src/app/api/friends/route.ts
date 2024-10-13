import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL!,
	process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export interface Friend {
	first_name: string;
	last_name: string;
	coins: number;
	is_premium: boolean;
}

export type GetFriendsResponse =
	| {
			meta: {
				error: string;
			};
			data: null;
	  }
	| {
			meta: {
				error: null;
			};
			data: Friend[];
	  };

export async function POST(request: Request) {
	try {
		const body = await request.json();
		const { userId } = body || {};

		const userFriendsResponse = await supabase
			.from('user_friends')
			.select(`friend_id(first_name,last_name,is_premium,coins)`)
			.eq('user_id', userId);

		if (userFriendsResponse.error) {
			throw new Error('Error');
		}

		const transformedFriends = userFriendsResponse.data.map(
			({ friend_id }) => friend_id,
		);

		const response: GetFriendsResponse = {
			meta: {
				error: null,
			},
			data: transformedFriends as unknown as Friend[],
		};
		return new Response(JSON.stringify(response));
	} catch (error) {
		let message = 'Error occurred';
		if (error instanceof Error) {
			message = error.message;
		}

		const response: GetFriendsResponse = {
			meta: {
				error: message,
			},
			data: null,
		};

		return new Response(JSON.stringify(response), {
			status: 500,
		});
	}
}
