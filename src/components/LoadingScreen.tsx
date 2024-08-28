'use client';

interface IndexProps {
	isLoading: boolean;
	isMobile: boolean;
}

export function LoadingScreen(props: IndexProps) {
	if (props.isLoading) {
		return (
			<div className={'flex h-full items-center justify-center'}>
				<img
					className={'w-[200px] animate-spin-slow'}
					src={'/assets/icons/photon.svg'}
				/>
			</div>
		);
	}

	if (!props.isMobile) {
		return (
			<div className={'flex h-full items-center justify-center'}>
				<h1>Photon is only available on mobile devices</h1>
			</div>
		);
	}

	return null;
}
