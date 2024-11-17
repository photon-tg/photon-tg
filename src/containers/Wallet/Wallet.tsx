'use client';

import { TonConnectButton, useTonAddress, useTonWallet } from '@tonconnect/ui-react';

export function Wallet() {
	const userFriendlyAddress = useTonAddress();
	const rawAddress = useTonAddress(false);
	const wallet = useTonWallet();

	return (
		<div>
			<div>
				<span>User-friendly address: {userFriendlyAddress}</span>
				<span>Raw address: {rawAddress}</span>
			</div>
			<div>
				{/*@ts-ignore*/}
				<span>Connected wallet: {wallet?.name}</span>
				<span>Device: {wallet?.device.appName}</span>
			</div>
			<TonConnectButton className={'tonConnectButton'} />
		</div>
	);
}
