import { graphql } from '@/gql';

export const GET_USER_TASK = graphql(`
	query UserTask($id: UUID!) {
		user_tasksCollection(filter: { id: { eq: $id } }) {
			edges {
				node {
					...FullUserTask
				}
			}
		}
	}
`);

export const GET_TASKS = graphql(`
	query Tasks($id: UUID!) {
		user_tasksCollection(filter: { user_id: { eq: $id } }) {
			edges {
				node {
					...FullUserTask
				}
			}
		}
		tasksCollection {
			edges {
				node {
					...FullTask
				}
			}
		}
	}
`);
