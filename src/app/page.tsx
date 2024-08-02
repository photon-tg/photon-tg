'use client';

import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(window.navigator.userAgent)) {
      router.replace('/photo/gallery');
    }

    setIsLoading(false);
  }, [router]);

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <h1>You may only use the app from a mobile device</h1>
  );
}
