export const HOME_PAGE =
	process.env.NEXT_PUBLIC_BATTLES_HIDDEN === 'true'
		? '/photo/gallery'
		: '/battle';

export const botURL = process.env.NEXT_PUBLIC_BOT_URL!;
