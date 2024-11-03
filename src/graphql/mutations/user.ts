import { graphql } from '@/gql';

export const UPDATE_USER = graphql(`
	mutation UpdateUser(
		$userId: UUID!
		$coins: Int!
		$energy: Int!
		$lastHourlyReward: Datetime!
		$lastDailyReward: Datetime
		$isReferred: Boolean
		$lastLikesClaim: Datetime
		$username: String
	) {
		updateusersCollection(
			atMost: 1
			set: {
				coins: $coins
				last_hourly_reward: $lastHourlyReward
				is_referred: $isReferred
				last_daily_reward: $lastDailyReward
				energy: $energy
				last_likes_claim: $lastLikesClaim
				username: $username
			}
			filter: { id: { eq: $userId } }
		) {
			records {
				...CoreUserFields
			}
		}
	}
`);
