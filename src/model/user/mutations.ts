import { graphql } from '@/gql';

export const ClaimReferrals = graphql(`
	mutation ClaimReferral($referrerUserId: UUID!) {
		updateuser_referencesCollection(
			atMost: 100
			set: { bonus_claimed: true }
			filter: { referrer_user_id: { eq: $referrerUserId } }
		) {
			records {
				...Referral
			}
		}
	}
`);
