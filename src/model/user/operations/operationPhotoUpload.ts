import { createAction, PayloadAction } from '@reduxjs/toolkit';
import { call, put, select } from '@redux-saga/core/effects';
import {
	userPhotosIsUploadingSet,
	userPhotosSet,
	userSet,
} from '@/model/user/actions';
import {
	userCoinsSelector,
	userIdSelector,
	userPhotosSelector,
} from '@/model/user/selectors';
import { AddBattlePhotoMutation, BattlePhotoFragment } from '@/gql/graphql';
import { v4 as uuidv4 } from 'uuid';
import { decode } from 'base64-arraybuffer';
import { getUserLevel, levelToPhotoReward } from '@/constants';
import { FetchResult } from '@apollo/client';
import * as Sentry from '@sentry/nextjs';
import { activeJoinBattleIdSelector } from '@/model/battle/selectors';
import { uploadPhoto, uploadPhotoToBucket } from '@/model/battle/services';
import { bucketURL } from '@/api/supabase';
import { battleHasJoinedSet } from '@/model/battle/actions';
import { operationBattleSelect } from '@/model/battle/operations/operationBattleSelect';

export const operationPhotoUpload = createAction<string>(
	'operation:user/photos/upload',
);

export function* operationPhotoUploadWorker({
	payload: photo,
}: PayloadAction<string>) {
	try {
		yield put(userPhotosIsUploadingSet(true));
		const userId: string = yield select(userIdSelector);
		const battleId: string = yield select(activeJoinBattleIdSelector);
		const coins: number = yield select(userCoinsSelector);
		const photos: BattlePhotoFragment[] = yield select(userPhotosSelector);
		const photoId: string = yield call(uuidv4);
		const photoArrayBuffer = decode(photo.split('base64,')[1]);

		const uploadPhotoToBucketResponse: Awaited<
			ReturnType<typeof uploadPhotoToBucket>
		> = yield call(
			uploadPhotoToBucket,
			userId,
			process.env.NEXT_PUBLIC_BATTLES_HIDDEN === 'true' ? 'nobattle' : battleId,
			photoId,
			photoArrayBuffer,
		);

		if (
			('error' in uploadPhotoToBucketResponse &&
				!!uploadPhotoToBucketResponse.error) ||
			!uploadPhotoToBucketResponse.data?.fullPath
		) {
			return;
		}

		const level = getUserLevel(coins);
		const coinsForPhoto = levelToPhotoReward.get(level)!;
		const newCoins = coinsForPhoto + coins;

		const uploadedPhotoResponse: FetchResult<AddBattlePhotoMutation> =
			yield call(uploadPhoto, {
				userId,
				battleId:
					process.env.NEXT_PUBLIC_BATTLES_HIDDEN === 'true'
						? undefined
						: battleId,
				level,
				url: `${bucketURL}/${uploadPhotoToBucketResponse.data?.fullPath}`,
				coins: newCoins,
			});

		const uploadedPhoto =
			uploadedPhotoResponse.data?.insertIntobattle_photosCollection
				?.records?.[0];
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
		yield put(userPhotosSet(newPhotos));
		yield put(battleHasJoinedSet(true));
		yield put(operationBattleSelect(battleId));
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
