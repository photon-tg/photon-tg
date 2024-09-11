import { graphql } from '@/gql';

export const ClaimReferrals = graphql(`
	mutation ClaimReferral($telegramId: String!) {
		updateuser_referralsCollection(atMost: 100, set: { is_claimed_by_referrer: true }, filter: { referrer_id: { eq: $telegramId } }) {
			records {
				...Referral
			}
		}
	}
`)
