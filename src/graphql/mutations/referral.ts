import { graphql } from '@/gql';

export const REFER_USER = graphql(`
	mutation ReferUser(
		$referrerTgId: String!
		$referralTgId: String!
		$userId: UUID!
		$coins: Int!
		$isUser: Boolean!
	) {
		insertIntouser_referralsCollection(
			objects: [
				{
					referral_id: $referralTgId
					referrer_id: $referrerTgId
					is_claimed_by_referrer: false
					is_user: $isUser
				}
			]
		) {
			records {
				id
			}
		}

		updateusersCollection(
			atMost: 1
			set: { coins: $coins, is_referred: true }
			filter: { id: { eq: $userId } }
		) {
			records {
				...CoreUserFields
			}
		}
	}
`);

export const CLAIM_REFERRAL = graphql(`
	mutation ClaimReferralOld($telegramId: String!) {
		updateuser_referralsCollection(
			atMost: 100
			set: { is_claimed_by_referrer: true }
			filter: { referrer_id: { eq: $telegramId } }
		) {
			records {
				is_claimed_by_referral
			}
		}
	}
`);
