import { graphql } from '@/gql';

export const SYNCHRONIZE_TAPS = graphql(`
	mutation SynchronizeTaps($userId: UUID!, $coins: Int!, $energy: Int!) {
		updateusersCollection(
			atMost: 1,
			set: {
				coins: $coins,
				energy: $energy
			},
			filter: {
				id: { eq: $userId }
			}
		) {
			records {
				...CoreUserFields
			}
		}
	}
`)

export const UPDATE_PASSIVE_INCOME = graphql(`
	mutation UpdatePassiveIncome($userId: UUID!, $coins: Int!, $lastHourlyReward: Datetime!) {
		updateusersCollection(
			atMost: 1,
			set: {
				coins: $coins,
				last_hourly_reward: $lastHourlyReward
			},
			filter: {
				id: { eq: $userId }
			}
		) {
			records {
				...CoreUserFields
			}
		}
	}
`)
