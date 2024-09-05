import { graphql } from '@/gql';

export const UPDATE_USER = graphql(`
	mutation UpdateUser($userId: UUID!, $coins: Int!, $lastHourlyReward: Datetime!, $lastDailyReward: Datetime, $isReferred: Boolean) {
		updateusersCollection(
			atMost: 1,
			set: {
				coins: $coins,
				last_hourly_reward: $lastHourlyReward,
				is_referred: $isReferred,
				last_daily_reward: $lastDailyReward,
			}
			filter: { id: { eq: $userId } }
		) {
			records {
				...CoreUserFields
			}
		}
	}
`)
