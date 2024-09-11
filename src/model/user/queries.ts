import { graphql } from '@/gql';

export const GetUserPhotos = graphql(`
	query GetUserPhotos($userId: UUID!) {
		user_photosCollection(
			first: 100
			orderBy: { created_at: DescNullsLast }
			filter: { user_id: { eq: $userId } }
		) {
			edges {
				node {
					...UserPhoto
				}
			}
		}
	}
`);

export const GetReferrals = graphql(`
	query GetReferrals($userId: String!) {
		user_referralsCollection(filter: { referrer_id: { eq: $userId } }) {
			edges {
				node {
					id
					referrer_id
					referral_id
				}
			}
		}
	}
`)

export const GetUserTasks = graphql(`
	query GetUserTasks($userId: UUID!) {
		user_tasksCollection(first: 100, offset: 0, filter: { user_id: { eq: $userId } }) {
			edges {
				node {
					...UserTask
				}
			}
		}
	}
`)

export const GetReferral = graphql(`
	query GetReferral($telegramId: String!) {
		user_referralsCollection(filter: {referral_id: { eq: $telegramId }}) {
			edges {
				node {
					...Referral
				}
			}
		}
	}
`)
