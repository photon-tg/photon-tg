import { graphql } from '@/gql';

export const CORE_USER_FIELDS = graphql(`
	fragment CoreUserFields on users {
		id
		coins
		energy
		last_daily_reward
		last_hourly_reward
		referrals
		last_photo
		created_at
	}
`);

