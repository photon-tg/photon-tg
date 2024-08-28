import { graphql } from '@/gql';

export const ADD_USER_PHOTO = graphql(`
	mutation AddUserPhoto($userId: UUID!, $photoId: String!, $currentLevel: Int!, $url: String!, $lastPhoto: Datetime!, $coins: Int!) {
		insertIntouser_photosCollection(objects: [{
			user_id: $userId,
			photo_id: $photoId,
			level_at_time: $currentLevel,
			url: $url
		}]) {
			records {
				...UserPhoto
			}
		}

		updateusersCollection(atMost: 1, set: { last_photo: $lastPhoto, coins: $coins }, filter: { id: { eq: $userId } }) {
			records {
				...CoreUserFields
			}
		}
	}
`);
