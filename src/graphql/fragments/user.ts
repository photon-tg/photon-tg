import { graphql } from '@/gql';

export const CORE_USER_FIELDS = graphql(`
	fragment CoreUserFields on users {
		id
		coins
		energy
		last_daily_reward
		last_hourly_reward
		last_photo
		created_at
		first_name
		last_name
		telegram_id
		last_sync
		is_referred
		is_premium
	}
`);
