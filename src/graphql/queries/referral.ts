import { graphql } from '@/gql';

export const GET_REFERRED = graphql(`
	query GetReferred($userTgId: String!) {
		user_referralsCollection(filter: {referral_id: { eq: $userTgId }}) {
			edges {
				node {
					id
					referrer_id
					referral_id
					users {
						is_premium
					}
				}
			}
		}
	}
`)
