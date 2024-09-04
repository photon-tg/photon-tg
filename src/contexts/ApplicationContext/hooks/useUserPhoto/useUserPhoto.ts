import { useCallback, useState } from 'react';
import { getUserPhotos, postUserPhoto } from '@/api/api';
import { User } from '@/interfaces/User';
import { Level } from '@/constants';
import { UserPhoto } from '@/interfaces/photo';

export function useUserPhoto(user: User) {
	const [photos, setPhotos] = useState<UserPhoto[]>([]);

	const getPhotos = useCallback(async () => {
		const photos = await getUserPhotos(user.id);
	}, [user]);

	const savePhoto = useCallback(async (image: string, level: Level, coins: number) => {
		const uploadedPhoto = await postUserPhoto(user.id, image!, level, coins);
		if (!uploadedPhoto.photo) {
			return;
		}

		setPhotos([...photos, uploadedPhoto.photo]);

	}, [user, photos]);

	return {
		getPhotos,
	};
}
