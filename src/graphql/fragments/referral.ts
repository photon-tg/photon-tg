import { graphql } from '@/gql';

export const REFERRAL = graphql(`
	fragment Referral on referrals {
		id
		referrals
		created_at
	}
`)
