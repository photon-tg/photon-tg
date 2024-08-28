import { CameraType } from 'react-camera-pro/dist/components/Camera/types';
import { useCallback, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserContext } from '@/contexts/UserContext';
import { postUserPhoto } from '@/api/api';
import { useApplicationContext } from '@/contexts/ApplicationContext/ApplicationContext';
import { CoreUserFieldsFragment } from '@/gql/graphql';

export function useCamera() {
	const cameraRef = useRef<CameraType | null>(null);
	const [image, setImage] = useState<string | null>(null);
	const router = useRouter();
	const { user, updateLocalUser } = useUserContext();
	const { level, coins, photos, updatePhotos } = useApplicationContext();

	const takePhoto = useCallback(() => {
		const base64Image = cameraRef.current?.takePhoto('base64url') as string;
		setImage(base64Image);
	}, [cameraRef]);

	const flip = useCallback(() => {
		cameraRef.current?.switchCamera();
	}, []);

	const onAccept = useCallback(async () => {
		if (!user) {
			return;
		}

		const postedPhotoData = await postUserPhoto(user.id, image!, level, coins);
		if (postedPhotoData) {
			updatePhotos([
				...photos,
				(postedPhotoData.insertIntouser_photosCollection as any)?.[0],
			]);
			updateLocalUser(
				postedPhotoData.updateusersCollection[0] as CoreUserFieldsFragment,
			);
		}

		router.push('/photo/gallery');
	}, [
		coins,
		image,
		level,
		photos,
		router,
		updateLocalUser,
		updatePhotos,
		user,
	]);

	const onReject = useCallback(() => {
		setImage(null);
	}, []);

	const goBack = useCallback(() => {
		router.push('/photo/gallery');
	}, [router]);

	return {
		cameraRef,
		image,
		takePhoto,
		flip,
		onReject,
		onAccept,
		goBack,
	};
}
