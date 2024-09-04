import { graphql } from '@/gql';

export const FULL_USER_TASK = graphql(`
	fragment FullUserTask on user_tasks {
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

export const FULL_TASK = graphql(`
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
