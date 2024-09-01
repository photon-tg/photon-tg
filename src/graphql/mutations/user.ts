import { graphql } from '@/gql';

export const UPDATE_USER = graphql(`
	mutation UpdateUser($userId: UUID!, $coins: Int!) {
		updateusersCollection(
			atMost: 1,
			set: {
				coins: $coins,
			}
			filter: { id: { eq: $userId } }
		) {
			records {
				...CoreUserFields
			}
		}
	}
`)
