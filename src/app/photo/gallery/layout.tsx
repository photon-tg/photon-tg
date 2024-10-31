import { Layout } from '@/components/Layout/Layout';
import { PhotoTabs } from '@/containers/Gallery/PhotoTabs/PhotoTabs';

export default function GalleryLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<Layout>
			<div className={'grid h-full grid-rows-[1fr_min-content]'}>
				{children}
				<div className={'pb-[20px]'}>
					<PhotoTabs />
				</div>
			</div>
		</Layout>
	);
}
