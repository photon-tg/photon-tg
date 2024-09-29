export async function retry<T>(
	req: Function,
	maxRetries = 3,
): Promise<T | void> {
	try {
		const result = await req();
		return result;
	} catch (err) {
		if (maxRetries === 0) {
			throw err;
		}

		retry(req, maxRetries - 1);
	}
}
