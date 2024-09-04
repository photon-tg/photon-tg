import { graphql } from '@/gql';

export const UPDATE_USER = graphql(`
	mutation UpdateUser($userId: UUID!, $coins: Int!, $lastHourlyReward: Datetime!) {
		updateusersCollection(
			atMost: 1,
			set: {
				coins: $coins,
				last_hourly_reward: $lastHourlyReward
			}
			filter: { id: { eq: $userId } }
		) {
			records {
				...CoreUserFields
			}
		}
	}
`)
