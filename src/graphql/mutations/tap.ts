import { graphql } from '@/gql';

export const SYNCHRONIZE_TAPS = graphql(`
	mutation SynchronizeTaps(
		$userId: UUID!
		$coins: Int!
		$energy: Int!
		$lastSync: Datetime
	) {
		updateusersCollection(
			atMost: 1
			set: { coins: $coins, energy: $energy, last_sync: $lastSync }
			filter: { id: { eq: $userId } }
		) {
			records {
				...CoreUserFields
			}
		}
	}
`);

export const UPDATE_PASSIVE_INCOME = graphql(`
	mutation UpdatePassiveIncome($userId: UUID!, $lastHourlyReward: Datetime!) {
		updateusersCollection(
			atMost: 1
			set: { last_hourly_reward: $lastHourlyReward }
			filter: { id: { eq: $userId } }
		) {
			records {
				...CoreUserFields
			}
		}
	}
`);
