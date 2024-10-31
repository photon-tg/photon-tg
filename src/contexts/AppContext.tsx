'use client';

import { createContext, PropsWithChildren, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { useDevice } from '@/hooks/useDevice';
import { applicationIsInitializedSelector } from '@/model/application/selectors';
import { userIsInitializedSelector } from '@/model/user/selectors';
import { operationInitApplication } from '@/model/application/operations';
import { HOME_PAGE } from '@/constants/urls';
import { LoadingScreen } from '@/components/LoadingScreen';
import { userEnergyAdd } from '@/model/user/actions';
import { operationUserInit } from '@/model/user/operations/operationUserInit';
import { battleIsInitializedSelector } from '@/model/battle/selectors';
import { operationBattleInitialize } from '@/model/battle/operations/operationBattleInitialize';

export interface AppContext {}

const initialAppContext: AppContext = {};

export const AppContext = createContext<AppContext>(initialAppContext);

export function AppContextProvider({ children }: PropsWithChildren<{}>) {
	const router = useRouter();
	const dispatch = useDispatch();
	const { isMobile, isDetected } = useDevice();
	const isApplicationInitialized = useSelector(
		applicationIsInitializedSelector,
	);
	const isUserInitialized = useSelector(userIsInitializedSelector);
	const isBattleInitialized = useSelector(battleIsInitializedSelector);

	useEffect(() => {
		if (!isDetected || (!process.env.NEXT_PUBLIC_ALLOW_DESKTOP! && !isMobile)) {
			return;
		}

		if (!isApplicationInitialized) {
			dispatch(operationInitApplication());
			return;
		}
		if (!isUserInitialized) {
			dispatch(operationUserInit());
			return;
		}
		if (!isBattleInitialized) {
			dispatch(operationBattleInitialize());
			return;
		}
	}, [
		dispatch,
		isApplicationInitialized,
		isBattleInitialized,
		isDetected,
		isMobile,
		isUserInitialized,
	]);

	useEffect(() => {
		if (isUserInitialized) {
			router.replace(HOME_PAGE);
		}
	}, [isUserInitialized, router]);

	useEffect(() => {
		if (!isUserInitialized || !isApplicationInitialized) return;
		let intervalId: NodeJS.Timeout;

		function increaseEnergy() {
			dispatch(userEnergyAdd(3));
		}

		intervalId = setInterval(increaseEnergy, 1000);

		return () => {
			clearInterval(intervalId);
		};
	}, [isApplicationInitialized, isUserInitialized]);

	const value = useMemo(() => ({}), []);

	const shouldChildrenRender =
		isDetected &&
		isUserInitialized &&
		isBattleInitialized &&
		isApplicationInitialized &&
		isMobile;
	return (
		<AppContext.Provider value={value}>
			{shouldChildrenRender ? (
				children
			) : (
				<LoadingScreen
					isLoading={!isDetected || !isUserInitialized}
					isMobile={isMobile}
				/>
			)}
		</AppContext.Provider>
	);
}
