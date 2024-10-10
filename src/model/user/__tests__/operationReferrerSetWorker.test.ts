import { expectSaga } from 'redux-saga-test-plan';
import { operationReferrerSetWorker } from '@/model/user/saga';
import userReducer, { getInitialState } from '@/model/user/reducer';
import { RegisteredUserState } from '@/model/user/types';
import { call, select } from '@redux-saga/core/effects';
import { userReferrerSelector, userSelector } from '@/model/user/selectors';
import { getReferral } from '@/model/user/services';
import { referUser } from '@/api/api';
import { CoreUserFieldsFragment } from '@/gql/graphql';

jest.mock('../../../api/graphql', () => ({
	apolloClient: {
		query: jest.fn(),
	},
}));

const telegramUser = {
	id: 812371481,
	first_name: 'TEST',
	last_name: 'TEST',
};

describe('operationReferrerSetWorker saga', () => {
	it('should', () => {
		const user: CoreUserFieldsFragment = {
			is_referred: null,
			telegram_id: '812371481',
			energy: 0,
			last_photo: null,
			id: 'ididiiididididid',
			created_at: new Date().toISOString(),
			last_daily_reward: null,
			first_name: telegramUser.first_name,
			last_name: telegramUser.last_name,
			is_premium: false,
			last_hourly_reward: new Date().toISOString(),
			coins: 0,
			last_sync: new Date().toISOString(),
			__typename: 'users',
		};

		const initialState = getInitialState();
		const state: RegisteredUserState = {
			...initialState,
			data: {
				...initialState.data,
				telegramUser: telegramUser,
				user,
				tasks: [],
				passiveIncome: 0,
				referrals: [],
				photos: {
					data: [],
					meta: {
						isUploading: false,
					},
				},
			},
			meta: {
				...initialState.meta,
				isLoading: false,
				referrerId: 'PARTNER',
			},
		};

		return expectSaga(operationReferrerSetWorker)
			.withReducer(userReducer, state)

			.provide([
				[select(userSelector), user],
				[select(userReferrerSelector), 'PARTNER'],
				[
					call(getReferral, '812371481'),
					{
						referenceData: {
							data: { user_referralsCollection: { edges: [] } },
						},
					},
				],
				[
					call(referUser, {
						referralTgId: '812371481',
						referrerTgId: 'PARTNER',
						userId: state.data.user.id,
						coins: 0,
						isUser: false,
					}),
					undefined,
				],
			])
			.run();
	});
});
