'use client';

import {
	createContext,
	PropsWithChildren,
	useCallback,
	useEffect,
	useMemo,
} from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { useDevice } from '@/hooks/useDevice';
import { applicationIsInitializedSelector } from '@/model/application/selectors';
import { userIsLoadingSelector } from '@/model/user/selectors';
import { operationInitApplication } from '@/model/application/operations';
import { HOME_PAGE } from '@/constants/urls';
import { LoadingScreen } from '@/components/LoadingScreen';
import { userEnergyAdd } from '@/model/user/actions';
import { operationUserInit } from '@/model/user/operations/operationUserInit';

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

	useEffect(() => {
		if (!isDetected || !isMobile) {
			return;
		}

		if (!isApplicationInitialized) {
			dispatch(operationInitApplication());
		} else {
			dispatch(operationUserInit());
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

		function increaseEnergy() {
			dispatch(userEnergyAdd(3));
		}

		intervalId = setInterval(increaseEnergy, 1000);

		return () => {
			clearInterval(intervalId);
		};
	}, [isApplicationInitialized, isUserLoading]);

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
