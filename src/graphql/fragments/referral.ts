import { graphql } from '@/gql';

export const Referral = graphql(`
	fragment Referral on user_referrals {
		id,
		referral_id,
		referrer_id,
		is_claimed_by_referrer,
		users {
			id,
			is_premium,
			coins,
			first_name
			last_name,
		}
	}
`)
