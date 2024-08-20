import { Layout } from '@/components/Layout/Layout';

export default function FriendsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Layout>{children}</Layout>
  )
}
