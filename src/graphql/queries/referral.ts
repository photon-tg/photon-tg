import { graphql } from '@/gql';

export const GET_REFERRALS = graphql(`
	query GetReferrals($userTgId: String!) {
		referralsCollection(filter: {id: { eq: $userTgId }}) {
			edges {
				node {
					...Referral
				}
			}
		}
	}
`)
