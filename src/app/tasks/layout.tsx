import { Layout } from '@/components/Layout/Layout';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Layout>{children}</Layout>
  );
}
