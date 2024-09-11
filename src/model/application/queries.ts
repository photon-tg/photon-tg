import { graphql } from '@/gql';

export const GetTasks = graphql(`
	query Tasks {
		tasksCollection {
			edges {
				node {
					...Task
				}
			}
		}
	}
`);
