import { createAction, PayloadAction } from '@reduxjs/toolkit';
import { call, put, select } from '@redux-saga/core/effects';
import {
	userCoinsAdd,
	userPhotosIsUploadingSet,
	userPhotosSet,
	userSet,
} from '@/model/user/actions';
import {
	userCoinsSelector,
	userIdSelector,
	userPhotosSelector,
} from '@/model/user/selectors';
import { AddUserPhotoMutation, UserPhotoFragment } from '@/gql/graphql';
import { v4 as uuidv4 } from 'uuid';
import { decode } from 'base64-arraybuffer';
import { uploadPhoto, uploadPhotoToBucket } from '@/model/user/services';
import { getUserLevel, levelToPhotoReward } from '@/constants';
import { FetchResult } from '@apollo/client';
import * as Sentry from '@sentry/nextjs';

export const operationPhotoUpload = createAction<string>(
	'operation:user/photos/upload',
);

export function* operationPhotoUploadWorker({
	payload: photo,
}: PayloadAction<string>) {
	try {
		yield put(userPhotosIsUploadingSet(true));
		const userId: string = yield select(userIdSelector);
		const coins: number = yield select(userCoinsSelector);
		const photos: UserPhotoFragment[] = yield select(userPhotosSelector);
		const photoId: string = yield call(uuidv4);
		const photoArrayBuffer = decode(photo.split('base64,')[1]);

		const uploadPhotoToBucketResponse: Awaited<
			ReturnType<typeof uploadPhotoToBucket>
		> = yield call(uploadPhotoToBucket, userId, photoId, photoArrayBuffer);

		if (uploadPhotoToBucketResponse.error) {
			return;
		}

		const level = getUserLevel(coins);
		const coinsForPhoto = levelToPhotoReward.get(level)!;
		const newCoins = coinsForPhoto + coins;

		const uploadedPhotoResponse: FetchResult<AddUserPhotoMutation> = yield call(
			uploadPhoto,
			userId,
			photoId,
			level,
			newCoins,
			new Date().toUTCString(),
		);
		const uploadedPhoto =
			uploadedPhotoResponse.data?.insertIntouser_photosCollection?.records[0];
		const updatedUser =
			uploadedPhotoResponse.data?.updateusersCollection.records[0];

		if (
			uploadedPhotoResponse.errors?.length ||
			!uploadedPhoto ||
			!updatedUser ||
			uploadedPhotoResponse.errors?.length
		) {
			return;
		}

		const newPhotos = [...photos, uploadedPhoto].sort(
			(a, b) =>
				new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
		);

		yield put(userSet(updatedUser));
		yield put(userCoinsAdd(coinsForPhoto));
		yield put(userPhotosSet(newPhotos));
		window.location.href = '/gallery';
	} catch (error) {
		Sentry.captureException(error, {
			contexts: {
				user: {},
				meta: {
					message: 'operationPayPassiveIncomeWorker',
				},
			},
		});
	} finally {
		yield put(userPhotosIsUploadingSet(false));
	}
}
