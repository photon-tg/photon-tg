import { FacingMode } from 'react-camera-pro/dist/components/Camera/types';
import { useCallback, useContext, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

import Webcam from 'react-webcam';
import { useDispatch, useSelector } from 'react-redux';
import { userSelector } from '@/model/user/selectors';
import { operationPhotoUpload } from '@/model/user/operations/operationPhotoUpload';
import { HOME_PAGE } from '@/constants/urls';
import { AppContext } from '@/contexts/AppContext';

export function useCamera() {
	const cameraRef = useRef<Webcam | null>(null);
	const [image, setImage] = useState<string | null>(null);
	const [facingMode, setFacingMode] = useState<FacingMode>('environment');
	const router = useRouter();
	const user = useSelector(userSelector);
	const dispatch = useDispatch();
	const { lang } = useContext(AppContext);

	const takePhoto = useCallback(() => {
		const base64Image = cameraRef.current?.getScreenshot();

		if (!base64Image) {
			return;
		}

		setImage(base64Image);
	}, [cameraRef]);

	const flip = useCallback(() => {
		setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'));
	}, []);

	const onAccept = useCallback(async () => {
		if (!user) {
			return;
		}

		dispatch(operationPhotoUpload(image!));
		setTimeout(() => {
			router.replace(`/${lang}${HOME_PAGE}`);
		}, 2000);
	}, [dispatch, image, lang, router, user]);

	const onReject = useCallback(() => {
		setImage(null);
	}, []);

	const goBack = useCallback(() => {
		router.push(`/${lang}/photo/gallery`);
	}, [lang, router]);

	return {
		cameraRef,
		image,
		takePhoto,
		flip,
		onReject,
		onAccept,
		goBack,
		facingMode,
	};
}
