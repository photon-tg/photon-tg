import { debounce, takeEvery, takeLeading } from '@redux-saga/core/effects';

import {
	operationUserInit,
	operationUserInitWorker,
} from '@/model/user/operations/operationUserInit';
import {
	operationAuthenticateUser,
	operationAuthenticateUserWorker,
} from '@/model/user/operations/operationAuthenticateUser';
import {
	operationInitDailyReward,
	operationInitDailyRewardWorker,
} from '@/model/user/operations/operationInitDailyReward';
import {
	operationReferralsClaim,
	operationReferralsClaimWorker,
} from '@/model/user/operations/operationReferralsClaim';
import {
	operationPassiveIncomePay,
	operationPassiveIncomePayWorker,
} from '@/model/user/operations/operationPassiveIncomePay';
import {
	operationPassiveEnergyRestore,
	operationPassiveEnergyRestoreWorker,
} from '@/model/user/operations/operationPassiveEnergyRestore';
import {
	operationPhotoUpload,
	operationPhotoUploadWorker,
} from '@/model/user/operations/operationPhotoUpload';
import {
	operationTapSync,
	operationTapSyncWorker,
} from '@/model/user/operations/operationTapSyncWorker';
import {
	operationTap,
	operationTapWorker,
} from '@/model/user/operations/operationTap';
import {
	operationTaskClaim,
	operationTaskClaimWorker,
} from '@/model/user/operations/operationTaskClaim';
import {
	operationReferralInit,
	operationReferralInitWorker,
} from '@/model/user/operations/operationReferralInit';
import {
	operationPhotoLikesCoinsReceive,
	operationPhotoLikesCoinsReceiveWorker,
} from '@/model/user/operations/operationPhotoLikesCoinsReceiveWorker';

function* userWatcher() {
	yield takeLeading(operationUserInit.type, operationUserInitWorker);
	yield takeLeading(
		operationAuthenticateUser.type,
		operationAuthenticateUserWorker,
	);
	yield takeLeading(
		operationInitDailyReward.type,
		operationInitDailyRewardWorker,
	);
	yield takeLeading(operationReferralInit.type, operationReferralInitWorker);
	yield takeLeading(
		operationReferralsClaim.type,
		operationReferralsClaimWorker,
	);
	yield takeLeading(
		operationPassiveIncomePay.type,
		operationPassiveIncomePayWorker,
	);
	yield takeLeading(
		operationPassiveEnergyRestore.type,
		operationPassiveEnergyRestoreWorker,
	);
	yield takeEvery(
		operationPhotoLikesCoinsReceive.type,
		operationPhotoLikesCoinsReceiveWorker,
	);
	yield takeLeading(operationPhotoUpload.type, operationPhotoUploadWorker);
	yield takeLeading(operationTaskClaim.type, operationTaskClaimWorker);
	yield takeEvery(operationTap.type, operationTapWorker);
	yield debounce(3000, operationTapSync.type, operationTapSyncWorker);
}

export default userWatcher;
