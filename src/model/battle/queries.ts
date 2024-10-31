import { graphql } from '@/gql';

export const GetBattles = graphql(`
	query GetBattles {
		battlesCollection {
			edges {
				node {
					...Battle
				}
			}
		}
	}
`);

export const GetBattlePhotos = graphql(`
	query GetBattlePhotos($battleId: BigInt!) {
		battle_photosCollection(filter: { battle_id: { eq: $battleId } }) {
			edges {
				node {
					...BattlePhoto
				}
			}
		}
	}
`);

export const GetUserBattlePhotos = graphql(`
	query GetUserBattlePhotos($userId: UUID!, $battleId: BigInt!) {
		battle_photosCollection(
			filter: { user_id: { eq: $userId }, battle_id: { eq: $battleId } }
		) {
			edges {
				node {
					...BattlePhoto
				}
			}
		}
	}
`);

export const GetPhotoLikes = graphql(`
	query GetPhotoLikes($photoId: BigInt) {
		photo_likesCollection(filter: { photo_id: { eq: $photoId } }) {
			edges {
				node {
					...PhotoLike
				}
			}
		}
	}
`);

// export const GetNotClaimedPhotosLikes = graphql(`
// 	query GetPhotoLikes($userId: UUID, $lastClaimed: Datetime) {
// 		photo_likesCollection(filter: { user_id: { eq: $userId }, created_at: { gt:$lastClaimed } }) {
// 			edges {
// 				node {
// 					...PhotoLike
// 				}
// 			}
// 		}
// 	}
// `);
