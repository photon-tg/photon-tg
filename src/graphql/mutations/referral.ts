import { graphql } from '@/gql';

export const REFER_USER = graphql(`
	mutation ReferUser($referrerTgId: String!, $referralTgId: String!) {
		insertIntouser_referralsCollection(objects: [{
			referral_id: $referralTgId,
			referrer_id: $referrerTgId,
			is_claimed_by_referrer: false,
		}]) {
			records {
				id
			}
		}
	}
`)

export const CLAIM_REFERRAL = graphql(`
	mutation ClaimReferral($telegramId: String!) {
		updateuser_referralsCollection(atMost: 100, set: { is_claimed_by_referrer: true }, filter: { referrer_id: { eq: $telegramId } }) {
			records {
				is_claimed_by_referral
			}
		}
	}
`)
