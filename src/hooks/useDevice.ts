import { useEffect, useMemo, useState } from 'react';

export type Device = 'mobile' | 'desktop';

export function useDevice() {
	const [device, setDevice] = useState<Device | null>(null);

	useEffect(() => {
		const isMobile =
			/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
				window.navigator.userAgent,
			);
		setDevice(isMobile ? 'mobile' : 'desktop');
	}, []);

	return useMemo(
		() => ({
			device,
			isMobile: device === 'mobile',
			isDetected: device !== null,
		}),
		[device],
	);
}
