'use client';

import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(window.navigator.userAgent)) {
      setIsLoading(false);
      return;
    }

    router.replace('/photo/gallery');
  }, [router]);

  useEffect(() => {
    const send = async () => {
      console.dir(window.Telegram, 'w')
      const resp = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dataCheckString: window?.Telegram?.WebApp.initData,
        })
      });
      console.log(resp, 'rr')
    }
send();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <h1>You may only use the app from a mobile device</h1>
  );
}
