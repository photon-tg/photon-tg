'use client';

import {redirect} from "next/navigation";

export default function Home() {
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    return redirect('/photo/gallery');
  }

  return (
    <h1>You may only use the app from a mobile device</h1>
  );
}
