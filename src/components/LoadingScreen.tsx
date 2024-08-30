'use client';

interface IndexProps {
	isLoading: boolean;
	isMobile: boolean;
}

export function LoadingScreen(props: IndexProps) {
	if (props.isLoading) {
		return (
			<div className={'flex h-full flex-col gap-y-[40px] items-center justify-center'}>
				<img
					className={'w-[200px] animate-spin-slow'}
					src={'/assets/icons/photon.svg'}
				/>
				<div className={'text-xxl text-[45px] text-[#1e315f] font-bold'}>Photon</div>
			</div>
		);
	}

	if (!props.isMobile) {
		return (
			<div className={'flex h-full flex-col gap-y-[30px] items-center justify-center'}>
				<img width={200} src={'/assets/icons/photon.svg'} />
				<h1 className={'text-xxl text-center text-[#2b4ca5]'}>Open on your mobile</h1>
			</div>
		);
	}

	return null;
}
