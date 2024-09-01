import { graphql } from '@/gql';

export const GET_USER_PHOTOS = graphql(`
	query GetUserPhotos($userId: UUID!) {
		user_photosCollection(
			first: 100
			orderBy: { created_at: DescNullsLast }
			filter: { user_id: { eq: $userId } }
		) {
			edges {
				node {
					...UserPhoto
				}
			}
		}
	}
`);
