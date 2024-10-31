import { createAction, PayloadAction } from '@reduxjs/toolkit';

export const operationBattlePhotoLike =
	createAction<string>('battle/photo/like');

export function* operationBattlePhotoLikeWorker({
	payload: likedPhotoId,
}: PayloadAction<string>) {}
