'use client';

import { createContext, PropsWithChildren, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { useDevice } from '@/hooks/useDevice';
import { applicationIsInitializedSelector } from '@/model/application/selectors';
import {
	userisConsentGivenSelector,
	userIsInitializedSelector,
} from '@/model/user/selectors';
import { operationInitApplication } from '@/model/application/operations';
import { HOME_PAGE } from '@/constants/urls';
import { LoadingScreen } from '@/components/LoadingScreen';
import {
	userEnergyAdd,
	userIsConsentGivenSet,
	userIsInitializedSet,
} from '@/model/user/actions';
import { operationUserInit } from '@/model/user/operations/operationUserInit';
import { battleIsInitializedSelector } from '@/model/battle/selectors';
import { operationBattleInitialize } from '@/model/battle/operations/operationBattleInitialize';
import { translationsIsInitializedSelector } from '@/model/translations/selectors';
import { operationTranslationsInit } from '@/model/translations/operations/operationTranslationsInit';
import { ConsentScreen } from '@/components/ConsentScreen';
import { useModalContext } from '@/contexts/ModalContext';

export interface AppContext {}

const initialAppContext: AppContext = {};

export const AppContext = createContext<AppContext>(initialAppContext);

export function AppContextProvider({ children }: PropsWithChildren<{}>) {
	const router = useRouter();
	const dispatch = useDispatch();
	const { isMobile, isDetected } = useDevice();
	const { openModal, closeModal } = useModalContext();
	const isApplicationInitialized = useSelector(
		applicationIsInitializedSelector,
	);
	const isUserInitialized = useSelector(userIsInitializedSelector);
	const isUserConsentGiven = useSelector(userisConsentGivenSelector);
	const isBattleInitialized = useSelector(battleIsInitializedSelector);
	const isTranslationsInitialized = useSelector(
		translationsIsInitializedSelector,
	);

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

		if (!isUserConsentGiven) return;

		if (!isBattleInitialized) {
			dispatch(operationBattleInitialize());
			return;
		}

		if (!isTranslationsInitialized) {
			dispatch(operationTranslationsInit());
			return;
		}
	}, [
		dispatch,
		isApplicationInitialized,
		isBattleInitialized,
		isDetected,
		isMobile,
		isTranslationsInitialized,
		isUserConsentGiven,
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
	}, [dispatch, isApplicationInitialized, isUserInitialized]);

	const onConsentAccept = () => {
		dispatch(userIsConsentGivenSet(true));
		dispatch(userIsInitializedSet(false));
	};

	const onConsentReject = () => {
		window.Telegram.WebApp?.close();
	};

	const value = useMemo(() => ({}), []);

	const shouldChildrenRender =
		isDetected &&
		isUserInitialized &&
		isBattleInitialized &&
		isApplicationInitialized &&
		isTranslationsInitialized &&
		(isMobile || process.env.NEXT_PUBLIC_ALLOW_DESKTOP);

	useEffect(() => {
		if (!isUserInitialized) return;
		closeModal();
		if (!isUserConsentGiven) {
			openModal(
				<ConsentScreen onAccept={onConsentAccept} onReject={onConsentReject} />,
				{
					position: 'center',
					withoutClose: true,
				},
			);
		}

		return () => {
			closeModal();
		};
	}, [closeModal, isUserConsentGiven, onConsentAccept, openModal]);

	return (
		<AppContext.Provider value={value}>
			{shouldChildrenRender ? (
				children
			) : (
				<LoadingScreen
					isLoading={
						!isDetected ||
						!isUserInitialized ||
						!isBattleInitialized ||
						!isUserConsentGiven
					}
					isMobile={isMobile}
				/>
			)}
		</AppContext.Provider>
	);
}
