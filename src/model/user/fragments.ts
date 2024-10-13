import { graphql } from '@/gql';

export const UserTask = graphql(`
	fragment UserTask on user_tasks {
		id
		completed
		created_at
		days_completed
		task_id
		status
		updated_at
		tasks {
			...FullTask
		}
	}
`);

export const Referral = graphql(`
	fragment Referral on user_references {
		id
		bonus_claimed
		is_referred_premium
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
		reward_by_level
		text_by_date
		reward_coins
		type
		link
		priority
	}
`);
