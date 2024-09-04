import { User } from '@/interfaces/User';
import { useCallback, useRef, useState } from 'react';
import { claimReferrals as claimReferralsReq, Friend, getFriend, getFriends, getReferral, referUser } from '@/api/api';
import { getUserLevel, PREMIUM_USER_REF_BONUS, USER_REF_BONUS } from '@/constants';
import { ReferralFragment } from '@/gql/graphql';
export type Referral = {
	firstName: string;
	lastName: string;
	coins: number;
	level: number;
}

export function useReferrals(user: User) {
	const [referrals, setReferrals] = useState<Referral[]>([]);
	const referralsCache = useRef<Friend[]>([]);

	const initMyReferrals = useCallback(async () => {
		const referrals = await getFriends(user.telegram_id);
		referralsCache.current = referrals;

		const parsedReferrals = referrals.map((ref) => ({
			firstName: ref.first_name,
			lastName: ref.last_name,
			level: getUserLevel(ref.coins),
			coins: ref.coins,
		}));

		setReferrals(parsedReferrals);
	}, [user.telegram_id]);

	const refer = useCallback(async (): Promise<number> => {
		if (!user.referrerId || user.telegram_id === user.referrerId) return 0;

		/* check if user already referred */
		const referenceData = await getReferral(user.telegram_id);
		if (referenceData) return 0;

		const referrer = await getFriend(user.referrerId);
		const isReferrerPremium = referrer.is_premium ?? false;

		const bonusCoins = isReferrerPremium ? PREMIUM_USER_REF_BONUS : USER_REF_BONUS;
		try {
			await referUser({ referralTgId: user.telegram_id, referrerTgId: user.referrerId });
		} catch (err) {
			return 0;
		}

		return bonusCoins;
	}, [user]);

	const claimReferrals = useCallback(async (friends: ReferralFragment[] | undefined): Promise<number> => {
		const bonusCoins = friends?.reduce((totalCoins, referral) => {
			if (referral.is_claimed_by_referrer) return totalCoins;

			const bonusPerReferral = referral.users.is_premium ? PREMIUM_USER_REF_BONUS : USER_REF_BONUS;

			return totalCoins + bonusPerReferral;
		}, 0);

		try {
			if (bonusCoins) {
				await claimReferralsReq(user.telegram_id);
			}
		} catch(err) {
			// TODO
		}

		return bonusCoins || 0;
	}, [user.telegram_id])

	return {
		initMyReferrals,
		refer,
		claimReferrals,
		referrals,
	}
}
