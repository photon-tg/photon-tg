export async function retry<T>(
	req: Function,
	maxRetries = 5,
): Promise<T | void> {
	try {
		return await req();
	} catch (err) {
		if (maxRetries === 0) {
			throw err;
		}

		retry(req, maxRetries - 1);
	}
}
