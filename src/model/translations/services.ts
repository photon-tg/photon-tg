import cms from '@/api/cms';

export const getBattleContent = async (
	voteId: string,
	joinId: string,
	locale: string,
): Promise<any> => {
	const response = await cms.getEntries({
		content_type: 'battleContent',
		locale,
		'fields.id[in]': `${voteId},${joinId}`,
	});
	return response.items.map(({ fields }) => fields);
};

export const getCommonTranslations = async (locale: string): Promise<any> => {
	const response = await cms.getEntry('3fHUbs9Ge44AMtneVF6G7x', { locale });
	return response.fields?.translations;
};
