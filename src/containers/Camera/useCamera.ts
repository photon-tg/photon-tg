import { CameraType, FacingMode } from 'react-camera-pro/dist/components/Camera/types';
import { useCallback, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserContext } from '@/contexts/UserContext';
import { postUserPhoto } from '@/api/api';
import { useApplicationContext } from '@/contexts/ApplicationContext/ApplicationContext';
import { CoreUserFieldsFragment } from '@/gql/graphql';
import { Level, levelToPhotoReward } from '@/constants';
import Webcam from 'react-webcam';

export function useCamera() {
	const cameraRef = useRef<Webcam | null>(null);
	const [image, setImage] = useState<string | null>(null);
	const [facingMode, setFacingMode] = useState<FacingMode>('environment');
	const router = useRouter();
	const { user, updateLocalUser } = useUserContext();
	const { level, coins, increaseCoins, photos, updatePhotos, updatePassiveIncomeLocal } = useApplicationContext();

	const takePhoto = useCallback(() => {
		const base64Image = cameraRef.current?.getScreenshot() as string;
		setImage(base64Image);
	}, [cameraRef]);

	const flip = useCallback(() => {
		setFacingMode((prev) => prev === 'user' ? 'environment' : 'user');
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
			increaseCoins((levelToPhotoReward.get(level as Level) as number));
			updateLocalUser(
				postedPhotoData.updateusersCollection[0] as CoreUserFieldsFragment,
			);
			updatePassiveIncomeLocal('photo');
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
		facingMode
	};
}
