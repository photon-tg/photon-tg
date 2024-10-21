import { graphql } from '@/gql';

export const Task = graphql(`
	fragment Task on tasks {
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
		cta_text
	}
`);
