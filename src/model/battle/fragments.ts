import { graphql } from '@/gql';

export const Battle = graphql(`
	fragment Battle on battles {
		id
		created_at
		is_active
		start_date
		end_date
	}
`);

export const BattlePhoto = graphql(`
	fragment BattlePhoto on battle_photos {
		id
		created_at
		battle_id
		user_id
		user_level
		photo_url
		claimed_at
	}
`);

export const PhotoLike = graphql(`
	fragment PhotoLike on photo_likes {
		id
		user_id
		photo_id
	}
`);
