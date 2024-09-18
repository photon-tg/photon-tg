'use client';

interface IndexProps {
	isLoading: boolean;
	isMobile: boolean;
}

export function LoadingScreen(props: IndexProps) {
	if (props.isLoading) {
		return (
			<div
				className={
					'flex h-full flex-col items-center justify-center gap-y-[40px]'
				}
			>
				<img
					className={'w-[200px] animate-spin-slow'}
					src={'/assets/icons/photon.svg'}
				/>
				<div className={'text-[45px] text-xxl font-bold text-[#1e315f]'}>
					Photon
				</div>
			</div>
		);
	}

	if (!props.isMobile) {
		return (
			<div
				className={
					'flex h-full flex-col items-center justify-center gap-y-[30px]'
				}
			>
				<img width={200} src={'/assets/icons/photon.svg'} />
				<h1 className={'text-center text-xxl text-[#2b4ca5]'}>
					Open on your mobile
				</h1>
			</div>
		);
	}

	return null;
}
