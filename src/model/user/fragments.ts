import { graphql } from '@/gql';

export const UserTask = graphql(`
	fragment UserTask on user_tasks {
		id
		completed
		created_at
		days_completed
		task_id
		tasks {
			...FullTask
		}
	}
`);

export const Referral = graphql(`
	fragment Referral on user_referrals {
		id
		referral_id
		referrer_id
		is_claimed_by_referrer
		users {
			id
			is_premium
			coins
			first_name
			last_name
		}
	}
`);

export const UserPhoto = graphql(`
	fragment UserPhoto on user_photos {
		id
		created_at
		level_at_time
		photo_id
		url
	}
`);

export const FullTask = graphql(`
	fragment FullTask on tasks {
		id
		created_at
		name
		description
		images {
			id
			url
			compressed_url
		}
		reward_by_day
		reward_coins
		type
	}
`);
