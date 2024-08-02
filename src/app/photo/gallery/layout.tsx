import { PhotoTabs } from "@/containers/Gallery/PhotoTabs/PhotoTabs";
import { Layout } from "@/components/Layout/Layout";

export default function GalleryLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Layout>
      <div className={"grid h-full grid-rows-[1fr_min-content]"}>
        {children}
        <div className={"pb-[10px]"}>
          <PhotoTabs />
        </div>
      </div>
    </Layout>
  );
}
