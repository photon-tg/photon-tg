import apolloClient from '@/api/graphql';
import { GetTasks } from '@/model/application/queries';

export const getTasks = () =>
	apolloClient.query({
		query: GetTasks,
		fetchPolicy: 'no-cache',
	});
