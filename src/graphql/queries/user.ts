import { graphql } from '@/gql';

export const GET_USER = graphql(`
	query User($id: UUID!) {
		usersCollection(filter: { id: { eq: $id } }) {
			edges {
				node {
					...CoreUserFields
				}
			}
		}
	}
`);

export const GetUserData = graphql(`
	query GetUserData(
		$userId: UUID!,
		$telegramId: String!,
	) {
		user_photosCollection(orderBy: [{ created_at: DescNullsLast }], first: 100, offset: 0, filter: { user_id: { eq: $userId } }) {
			edges {
				node {
					...UserPhoto,
				}
			}
		}

		user_referralsCollection(first: 100, offset: 0, filter: { or: [{ referrer_id: { eq: $telegramId } }, { referral_id: { eq: $telegramId } }] }) {
			edges {
				node {
					...Referral,
				}
			}
		}

		tasksCollection(first: 100, offset: 0) {
			edges {
				node {
					...FullTask
				}
			}
		}

		user_tasksCollection(first: 100, offset: 0, filter: { user_id: { eq: $userId } }) {
			edges {
				node {
					...FullUserTask
				}
			}
		}
	}
`)
