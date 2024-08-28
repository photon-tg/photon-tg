'use client';

import { useApplicationContext } from '@/contexts/ApplicationContext/ApplicationContext';
import { useEffect } from 'react';
import { HOME_PAGE } from '@/constants/urls';
import { useRouter } from 'next/navigation';
import { LoadingScreen } from '@/components/LoadingScreen';

export function Index() {
	const { isAppInitialized } = useApplicationContext();
	const router = useRouter();

	useEffect(() => {
		if (isAppInitialized) {
			router.replace(HOME_PAGE);
		}
	}, [isAppInitialized, router]);

	return <LoadingScreen isLoading={true} isMobile={true} />
}
