import cms from '@/api/cms';

export const getBattleContent = async (
	battleId: string,
	locale: string,
): Promise<any> => {
	const response = await cms.getEntries({
		content_type: 'battleContent',
		locale,
		'fields.id': battleId,
	});
	return response.items[0]?.fields;
};

export const getCommonTranslations = async (locale: string): Promise<any> => {
	const response = await cms.getEntry('3fHUbs9Ge44AMtneVF6G7x', { locale });
	return response.fields?.translations;
};
