import { TelegramAuth } from '@/utils/telegram-auth-verification';
import { z } from 'zod';
import { UserErrorType } from '@/model/user/types';

export const runtime = "node"

const AuthenticationData = z.object({
	dataCheckString: z.string().trim().min(1),
});

type AuthenticationDataBody = z.infer<typeof AuthenticationData>;

export type ValidatedTelegramUser =
	| {
			isValid: false;
			error: {
				type: UserErrorType;
				message: string;
			};
	  }
	| {
			user: WebAppUser;
			referrerId: string | null;
			isValid: true;
			error: null;
	  };

// Add caching or JWT tokens on top
// TODO: use ready-made lib https://github.com/Telegram-Mini-Apps/telegram-apps/tree/master/packages/init-data-node
export async function POST(request: Request) {
	const body: AuthenticationDataBody = await request.json();

	const { error, data } = AuthenticationData.safeParse(body);

	if (error) {
		return new Response(
			JSON.stringify({
				isValid: false,
				error: {
					type: UserErrorType.INVALID_DATA_CHECK_STRING,
					message: 'dataCheckString is invalid',
				},
			}),
			{
				status: 400,
			},
		);
	}

	try {
		const dataCheckString = data?.dataCheckString;
		const dataCheckStringDecoded = decodeURIComponent(dataCheckString);
		const tgAuthClient = new TelegramAuth(dataCheckStringDecoded);
		const isDataValid = tgAuthClient.verifyAuthString();

		if (!isDataValid) {
			return new Response(
				JSON.stringify({
					isValid: false,
					error: {
						type: UserErrorType.INVALID_DATA_CHECK_STRING,
						message: 'dataCheckString is invalid',
					},
				}),
				{ status: 403 },
			);
		}

		const userData = tgAuthClient.parseAuthString();

		return new Response(
			JSON.stringify({
				user: userData.user,
				referrerId: userData.referrerId,
				isValid: true,
				error: null,
			} as ValidatedTelegramUser),
			{
				status: 200,
			},
		);
	} catch (err) {
		console.error(err, 'error');
		return new Response(
			JSON.stringify({
				isValid: false,
				error: {
					type: UserErrorType.SERVER_ERROR,
					message: 'Internal server error',
				},
			}),
			{
				status: 500,
			},
		);
	}
}
