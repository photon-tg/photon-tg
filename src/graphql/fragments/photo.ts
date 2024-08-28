import { graphql } from '@/gql';

export const USER_PHOTO = graphql(`
	fragment UserPhoto on user_photos {
		id
		created_at
		level_at_time
		photo_id
		url
	}
`);
