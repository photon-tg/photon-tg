import apolloClient from '@/api/graphql';
import { GetTasks } from '@/model/application/queries';
import { retry } from '@/utils/api';

export const getTasks = () =>
	retry(() =>
		apolloClient.query({
			query: GetTasks,
			fetchPolicy: 'no-cache',
		}),
	);
