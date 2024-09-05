import { FacingMode } from 'react-camera-pro/dist/components/Camera/types';
import { useCallback, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserContext } from '@/contexts/UserContext';

import { useApplicationContext } from '@/contexts/ApplicationContext/ApplicationContext';

import Webcam from 'react-webcam';

export function useCamera() {
	const cameraRef = useRef<Webcam | null>(null);
	const [image, setImage] = useState<string | null>(null);
	const [facingMode, setFacingMode] = useState<FacingMode>('environment');
	const router = useRouter();
	const { user, updateLocalUser } = useUserContext();
	const { addPhoto } = useApplicationContext();

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

		await addPhoto(image!);

		router.push('/photo/gallery');
	}, [addPhoto, image, router, user]);

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
