import { useCallback, useState } from 'react';

import { BattlePhotoFragment } from '@/gql/graphql';
import { useDispatch } from 'react-redux';
import { operationBattleSelect } from '@/model/battle/operations/operationBattleSelect';

export const PHOTOS_PER_PAGE = 8;

export function useGalleryPhotos(photos: BattlePhotoFragment[]) {
	const [page, setPage] = useState(0);
	const totalPages = Math.ceil(photos.length / PHOTOS_PER_PAGE);
	const [selectedImage, setSelectedImage] = useState(photos[0]);
	const dispatch = useDispatch();
	const hasNextPage = page + 1 < totalPages;
	const hasPrevPage = page !== 0;

	const toPrev = useCallback(() => {
		setPage((prevPage) => prevPage - 1);
	}, []);

	const toNext = useCallback(() => {
		setPage((prevPage) => prevPage + 1);
	}, []);

	const changeSelectedImage = useCallback(
		(id: string) => {
			const selImg = photos.find((photo) => photo.id === id);
			if (selImg) {
				if (selImg.battle_id) {
					dispatch(operationBattleSelect(selImg.battle_id));
				}
				setSelectedImage(selImg);
			}
		},
		[photos, dispatch],
	);

	return {
		page,
		totalPages,
		toNext,
		toPrev,
		selectedImage,
		changeSelectedImage,
		hasNextPage,
		hasPrevPage,
	};
}
