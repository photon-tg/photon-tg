'use client';

import {
	createContext,
	PropsWithChildren,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from 'react';

import { authApi } from '@/api/auth';
import { User } from '@/interfaces/User';
import { getUser } from '@/api/api';
import { isNextDay } from '@/utils/date';
import { useDevice } from '@/hooks/useDevice';
import { LoadingScreen } from '@/components/LoadingScreen';

interface UserContext {
	user: User;
	authenticate(): Promise<void>;
	updateLocalUser(user: Partial<User>): User;
}

const initialUserContext: UserContext = {
	user: null!,
	authenticate() { return Promise.resolve() },
	updateLocalUser() { return null! },
};

const UserContext = createContext<UserContext>(initialUserContext);

export function UserContextProvider({ children }: PropsWithChildren<{}>) {
	const { isMobile, isDetected } = useDevice();
	const [user, setUser] = useState<User>(null!);

	const modifyUser = useCallback((userData: Partial<User>): User => {
		return userData as User;
	}, []);

	const authenticate = useCallback(async () => {
		const authData = await authApi.authenticate();

		const userData = await getUser(authData.id);

		if (!userData) {
			throw new Error();
		}

		const fullUserData: User = modifyUser({ ...authData, ...userData });
		setUser(fullUserData);
	}, [modifyUser]);

	useEffect(() => {
		if (!!user || !isMobile) {
			return;
		}

		authenticate();
	}, [authenticate, isMobile, user]);

	const updateLocalUser = useCallback(
		(newUser: Partial<User>) => {
			const updatedUser = modifyUser({ ...user, ...newUser });

			setUser(updatedUser);
			return updatedUser;
		},
		[modifyUser, user],
	);

	const value = useMemo<UserContext>(
		() => ({
			user,
			authenticate,
			updateLocalUser,
		}),
		[user, authenticate, updateLocalUser],
	);

	return (
		<UserContext.Provider value={value}>
			{!!user && children}
			{!user && <LoadingScreen isLoading={!isDetected} isMobile={isMobile} />}
		</UserContext.Provider>
	);
}

export function useUserContext() {
	const context = useContext(UserContext);
	if (!context) {
		throw new Error('useUserContext is used outside of its Provider');
	}

	return useContext(UserContext);
}
