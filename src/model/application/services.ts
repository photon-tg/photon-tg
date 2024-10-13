import apolloClient from '@/api/graphql';
import { GetTasks } from '@/model/application/queries';
import { retry } from '@/utils/api';

export const getTasks = () => {
	const query = async () => {
		const res = await apolloClient.query({
			query: GetTasks,
			fetchPolicy: 'no-cache',
		});

		if (res.data.tasksCollection?.edges?.length === 0) {
			throw new Error('no tasks');
		}

		return res;
	};

	return retry(query);
};
