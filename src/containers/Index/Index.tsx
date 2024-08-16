"use client";

import { HOME_PAGE } from "@/constants/urls";
import { useApplicationContext } from "@/contexts/ApplicationContext/ApplicationContext";
import { useUserContext } from "@/contexts/UserContext";
import { useDevice } from "@/hooks/useDevice";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface IndexProps {}

export function Index(props: IndexProps) {
  const { isMobile, isDetected } = useDevice();
  const { user } = useUserContext();
  const { clientReady } = useApplicationContext();

  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.replace(HOME_PAGE);
    }

    if (!isDetected) {
      return;
    }

    async function checkDevice() {
      if (isMobile) {
        await clientReady();
      }

      setIsLoading(false);
    }

    checkDevice();
  }, [isMobile, isDetected, user]);

  if (isLoading) {
    return (
      <div className={"flex h-full items-center justify-center"}>
        <img
          className={"w-[200px] animate-spin-slow"}
          src={"/assets/icons/photon.svg"}
        />
      </div>
    );
  }

  if (!isMobile) {
    return (
      <div className={"flex h-full items-center justify-center"}>
        <h1>Photon is only available on mobile devices</h1>
      </div>
    );
  }

  return null;
}
