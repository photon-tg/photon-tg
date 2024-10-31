import cms from '@/api/cms';
import { BattleContent } from '@/model/translations/types';

export const getBattleContent = async (battleId: string): Promise<any> => {
	const response = await cms.getEntries({
		content_type: 'battleContent',
		'fields.id': battleId,
	});
	return response.items[0]?.fields;
};
