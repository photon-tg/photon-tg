import * as crypto from 'crypto';

export interface ParseAuthStringResult {
	user: WebAppUser;
	referrerId: string | null;
}

export interface TelegramAuthInterface {
	tgInitData: string;
	verifyAuthString(): boolean;
	parseAuthString(): ParseAuthStringResult;
}

export class TelegramAuth implements TelegramAuthInterface {
	public tgInitData: string;

	constructor(telegramInitData: string) {
		this.tgInitData = telegramInitData;
	}

	verifyAuthString() {
		// HMAC-SHA-256 signature of the bot's token with the constant string WebAppData used as a key.
		const secret = crypto
			.createHmac('sha256', 'WebAppData')
			.update(process.env.TELEGRAM_BOT_TOKEN!);

		// Data-check-string is a chain of all received fields'.
		const arr = this.tgInitData.split('&');
		const hashIndex = arr.findIndex((str) => str.startsWith('hash='));
		const hash = arr.splice(hashIndex)[0].split('=')[1];
		// Sorted alphabetically
		arr.sort((a, b) => a.localeCompare(b));
		// In the format key=<value> with a line feed character ('\n', 0x0A) used as separator
		// e.g., 'auth_date=<auth_date>\nquery_id=<query_id>\nuser=<user>
		const dataCheckString = arr.join('\n');

		// The hexadecimal representation of the HMAC-SHA-256 signature of the data-check-string with the secret key
		const _hash = crypto
			.createHmac('sha256', secret.digest())
			.update(dataCheckString)
			.digest('hex');

		// If hash is equal, the data may be used on your server.
		// Complex data types are represented as JSON-serialized objects.
		return _hash === hash;
	}

	parseAuthString(): ParseAuthStringResult {
		// parse string to get params
		const searchParams = new URLSearchParams(this.tgInitData);

		// take the hash and remove it from params list
		const hash = searchParams.get('hash') as string;
		searchParams.delete('hash');

		// sort params
		const restKeys = Array.from(searchParams.entries());
		restKeys.sort(([aKey, _aValue], [bKey, _bValue]) =>
			aKey.localeCompare(bKey),
		);

		// and join it with \n
		const dataCheckString = restKeys.map(([n, v]) => `${n}=${v}`).join('\n');
		console.log(searchParams.get('user'))
		return {
			user: JSON.parse(searchParams.get('user') as string) as WebAppUser,
			referrerId: this.parseStartParams(searchParams.get('start_param')),
		};
	}

	private parseStartParams(startParams: string | null): string | null {
		try {
			const [, match] = startParams?.match(/friendId(\d+)/) || [];
			return match;
		} catch (err) {
			return null;
		}
	}
}
