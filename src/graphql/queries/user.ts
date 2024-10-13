import { graphql } from '@/gql';

export const GET_USER = graphql(`
	query User($id: UUID!) {
		usersCollection(filter: { id: { eq: $id } }) {
			edges {
				node {
					...CoreUserFields
				}
			}
		}
	}
`);
