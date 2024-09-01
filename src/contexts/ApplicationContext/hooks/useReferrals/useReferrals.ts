import { User } from '@/interfaces/User';
import { useCallback, useRef, useState } from 'react';
import { claimReferrals as claimReferralsReq, Friend, getFriends, getReferral, referUser } from '@/api/api';
import { getUserLevel, PREMIUM_USER_REF_BONUS, USER_REF_BONUS } from '@/constants';
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
		const referrals = await getFriends();
		referralsCache.current = referrals;

		const parsedReferrals = referrals.map((ref) => ({
			firstName: ref.first_name,
			lastName: ref.last_name,
			level: getUserLevel(ref.coins),
			coins: ref.coins,
		}));

		setReferrals(parsedReferrals);
	}, []);

	const saveReferrer = useCallback(async (): Promise<number | undefined> => {
		if (!user.referrerId && user.telegram_id !== user.referrerId) return;

		/* check if user already referred */
		const referenceData = await getReferral(user.telegram_id);
		if (referenceData) return;

		const bonusCoins = user.telegram.is_premium ? PREMIUM_USER_REF_BONUS : USER_REF_BONUS;

		await referUser({ referralTgId: user.telegram_id, referrerTgId: user.referrerId });
		return bonusCoins;
	}, [user]);

	const claimReferrals = useCallback(async (): Promise<number> => {
		const bonusCoins = referralsCache.current.reduce((totalCoins, referral) => {
			if (referral.is_claimed_by_referrer) return totalCoins;

			const bonusPerReferral = referral.is_premium ? PREMIUM_USER_REF_BONUS : USER_REF_BONUS;

			return totalCoins + bonusPerReferral;
		}, 0);

		if (bonusCoins) {
			await claimReferralsReq(user.telegram_id);
		}

		return bonusCoins;
	}, [user.telegram_id])

	return {
		initMyReferrals,
		saveReferrer,
		claimReferrals,
		referrals,
	}
}
