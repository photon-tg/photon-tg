import { Layout } from '@/components/Layout/Layout';
import { Profile } from '@/pages/Tap/Profile';

export default function TapLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return <Layout externalChildren={<Profile />}>{children}</Layout>;
}
