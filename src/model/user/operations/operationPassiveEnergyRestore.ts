import { CoreUserFieldsFragment } from '@/gql/graphql';
import { call, put, select } from '@redux-saga/core/effects';
import { userSelector } from '@/model/user/selectors';
import {
	calculateEnergyGained,
	CalculateEnergyGainedResponse,
} from '@/utils/date';
import { getUserLevel, levelToMaxEnergy } from '@/constants';
import { userEnergySet } from '@/model/user/actions';
import { createAction } from '@reduxjs/toolkit';

export const operationPassiveEnergyRestore = createAction(
	'operation:user/energy/restore',
);

export function* operationPassiveEnergyRestoreWorker() {
	const user: CoreUserFieldsFragment = yield select(userSelector);
	const { newEnergy }: CalculateEnergyGainedResponse = yield call(
		calculateEnergyGained,
		user.last_sync,
		user.energy,
	);

	const maxEnergy = levelToMaxEnergy.get(getUserLevel(user.coins))!;
	const updatedEnergy = newEnergy > maxEnergy ? maxEnergy : newEnergy;
	yield put(userEnergySet(updatedEnergy));
}
