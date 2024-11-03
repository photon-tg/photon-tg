import { graphql } from '@/gql';

export const ViewPhotos = graphql(`
	mutation ViewPhotos($objects: [battle_photo_viewsInsertInput!]!) {
		insertIntobattle_photo_viewsCollection(objects: $objects) {
			records {
				id
			}
		}
	}
`);

export const LikePhoto = graphql(`
	mutation LikePhoto($userId: UUID!, $photoId: BigInt!) {
		insertIntophoto_likesCollection(
			objects: { photo_id: $photoId, user_id: $userId }
		) {
			records {
				id
			}
		}
	}
`);

export const AddBattlePhoto = graphql(`
	mutation AddBattlePhoto(
		$userId: UUID!
		$battleId: BigInt
		$url: String!
		$userLevel: Int!
		$coins: Int!
		$lastPhoto: Datetime!
	) {
		insertIntobattle_photosCollection(
			objects: {
				user_id: $userId
				battle_id: $battleId
				photo_url: $url
				user_level: $userLevel
			}
		) {
			records {
				...BattlePhoto
			}
		}

		updateusersCollection(
			filter: { id: { eq: $userId } }
			set: { coins: $coins, last_photo: $lastPhoto }
		) {
			records {
				...CoreUserFields
			}
		}
	}
`);
