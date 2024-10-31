import { graphql } from '@/gql';

export const GetAllUserPhotos = graphql(`
	query GetAllUserPhotos($userId: UUID!) {
		battle_photosCollection(
			first: 100
			orderBy: { created_at: DescNullsLast }
			filter: { user_id: { eq: $userId } }
		) {
			edges {
				node {
					...BattlePhoto
				}
			}
		}
	}
`);

export const GetReferrals = graphql(`
	query GetReferrals($userId: UUID!) {
		user_referencesCollection(filter: { referrer_user_id: { eq: $userId } }) {
			edges {
				node {
					...Referral
				}
			}
		}
	}
`);

export const GetUserTasks = graphql(`
	query GetUserTasks($userId: UUID!) {
		user_tasksCollection(
			first: 100
			offset: 0
			filter: { user_id: { eq: $userId } }
		) {
			edges {
				node {
					...UserTask
				}
			}
		}
	}
`);
