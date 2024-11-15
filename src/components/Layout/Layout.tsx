import { PropsWithChildren, ReactNode } from 'react';
import { Navigation } from '@/components/Navigation/Navigation';

export interface LayoutProps {
	externalChildren?: ReactNode | undefined;
}

export function Layout(props: PropsWithChildren<LayoutProps>) {
	const { children, externalChildren } = props;

	return (
		<main
			className={`grid ${externalChildren ? 'grid-rows-[min-content_1fr]' : 'grid-rows-1'} relative mx-auto h-full w-full max-w-[375px] overflow-hidden px-[0px] pt-[5px]`}
		>
			{externalChildren}
			<div
				className={
					'grid h-full w-full grid-rows-[1fr_min-content] rounded-tl rounded-tr bg-[#041837]'
				}
			>
				<div className={'h-full overflow-auto'}>{children}</div>
				<Navigation />
			</div>
		</main>
	);
}
