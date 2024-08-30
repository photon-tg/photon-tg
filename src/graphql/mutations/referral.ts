import { graphql } from '@/gql';

export const REFER_USER = graphql(`
	mutation ReferUser($referrerTgId: String!, $referralTgId: String!, $coins: Int!, $userId: UUID!) {
		insertIntouser_referralsCollection(objects: [{
			referral_id: $referralTgId,
			referrer_id: $referrerTgId,
			is_claimed_by_referrer: false,
		}]) {
			records {
				id
			}
		}

		updateusersCollection(atMost: 1, set: { coins: $coins }, filter: { id: { eq: $userId } }) {
			records {
				...CoreUserFields
			}
		}
	}
`)

export const CLAIM_REFERRAL = graphql(`
	mutation ClaimReferral($userId: UUID!, $telegramId: String!, $coins: Int!) {
		updateuser_referralsCollection(set: { is_claimed_by_referrer: true }, filter: {referrer_id: {eq: $telegramId}}) {
			records {
				is_claimed_by_referral
			}
		}

		updateusersCollection(atMost: 1, set: {coins: $coins}, filter: {id: {eq: $userId}}) {
			records {
				...CoreUserFields
			}
		}
	}
`)
