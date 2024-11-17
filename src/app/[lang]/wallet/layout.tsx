import { Layout } from '@/components/Layout/Layout';

export default function WalletLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return <Layout>{children}</Layout>;
}
