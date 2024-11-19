import { Button } from '@/components/Button/Button';
import { PrivacyPolicy } from '@/components/PrivacyPolicy';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { TermsOfUse } from '@/components/TermsOfUse';

export interface ConsentScreenProps {
	onAccept(): void;
	onReject(): void;
}

export function ConsentScreen(props: ConsentScreenProps) {
	const { onAccept, onReject } = props;
	const [docShown, setDocShown] = useState<'pp' | 'tou' | ''>('');
	console.log('here')
	return (
		<>
			<div className={'px-[10px] pb-[10px] pt-[0px] z-50'}>
				<div className={'mb-[20px]'}>
					You must accept{' '}
					<a
						onClick={() =>
							window.Telegram.WebApp.openLink(
								'https://www.termsfeed.com/live/ae4a1868-32c7-47d6-b61e-f04372331d71',
							)
						}
						className={'underline'}
					>
						Privacy policy
					</a>{' '}
					and{' '}
					<a onClick={() => setDocShown('tou')} className={'underline'}>
						Terms of use
					</a>{' '}
					to use the application
				</div>
				<div className={'flex gap-x-[5px]'}>
					<Button onClick={onAccept}>I Accept</Button>
					<Button onClick={onReject}>Reject</Button>
				</div>
			</div>
			{/*{docShown === 'pp' && createPortal(<PrivacyPolicy onClose={() => setDocShown('')} />, document.querySelector('body')!)}*/}
			{docShown === 'tou' &&
				createPortal(
					<TermsOfUse onClose={() => setDocShown('')} />,
					document.querySelector('body')!,
				)}
		</>
	);
}
