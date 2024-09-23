'use client';

import { createContext, PropsWithChildren, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { useDevice } from '@/hooks/useDevice';
import { applicationIsInitializedSelector } from '@/model/application/selectors';
import { userIsLoadingSelector, userSelector } from '@/model/user/selectors';
import { operationInitApplication } from '@/model/application/operations';
import { operationInitUser } from '@/model/user/operations';
import { HOME_PAGE } from '@/constants/urls';
import { LoadingScreen } from '@/components/LoadingScreen';
import { getUserLevel, levelToMaxEnergy } from '@/constants';
import { userEnergyAdd, userEnergySet } from '@/model/user/actions';

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
	const isUserLoading = useSelector(userIsLoadingSelector);
	const user = useSelector(userSelector);

	useEffect(() => {
		if (!isDetected || !isMobile) {
			return;
		}

		if (!isApplicationInitialized) {
			dispatch(operationInitApplication());
		} else {
			dispatch(operationInitUser());
		}
	}, [dispatch, isApplicationInitialized, isDetected, isMobile]);

	useEffect(() => {
		if (!isUserLoading) {
			router.replace(HOME_PAGE);
		}
	}, [isUserLoading, router]);

	useEffect(() => {
		if (isUserLoading || !isApplicationInitialized) return;
		let intervalId: NodeJS.Timeout;

		if (user.energy >= levelToMaxEnergy.get(getUserLevel(user.coins))!) {
			dispatch(userEnergySet(levelToMaxEnergy.get(getUserLevel(user.coins))!));
			return;
		}

		function regenerateEnergy() {
			dispatch(userEnergyAdd(3));
		}

		intervalId = setInterval(regenerateEnergy, 1000);

		return () => {
			clearInterval(intervalId);
		};
	}, [
		dispatch,
		isApplicationInitialized,
		isUserLoading,
		user?.coins,
		user?.energy,
	]);

	const value = useMemo(() => ({}), []);

	const shouldChildrenRender = isDetected && !isUserLoading && isMobile;
	return (
		<AppContext.Provider value={value}>
			{shouldChildrenRender ? (
				children
			) : (
				<LoadingScreen
					isLoading={!isDetected || isUserLoading}
					isMobile={isMobile}
				/>
			)}
		</AppContext.Provider>
	);
}
