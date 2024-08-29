import { graphql } from '@/gql';

export const REFER_FIRST = graphql(`
	mutation ReferFirst($referredTgIds: [String]!, $referrerTgId: String!) {
		insertIntoreferralsCollection(objects: [{
			id: $referrerTgId
			referrals: $referredTgIds,
		}]) {
			records {
				created_at
			}
		}
	}
`)

export const REFER = graphql(`
	mutation Refer($referredTgIds: [String]!, $referrerTgId: String!) {
		updatereferralsCollection(atMost: 1, set: { referrals: $referredTgIds }, filter: { id: { eq: $referrerTgId } }) {
			records {
				created_at
			}
		}
	}
`)
