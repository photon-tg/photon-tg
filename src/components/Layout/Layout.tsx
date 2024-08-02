import { PropsWithChildren } from "react";
import { Navigation } from "@/components/Navigation/Navigation";

export interface LayoutProps {}

export function Layout({ children }: PropsWithChildren<LayoutProps>) {
  return (
    <main
      className={
        "mx-auto grid h-full w-full max-w-[375px] grid-rows-[1fr_min-content] px-[5px] pt-[5px]"
      }
    >
      <div
        className={
          "h-full translate-y-[5px] rounded-tl rounded-tr bg-dark-blue"
        }
      >
        {children}
      </div>
      <Navigation />
    </main>
  );
}
