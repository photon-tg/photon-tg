import { CameraType } from "react-camera-pro/dist/components/Camera/types";
import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export function useCamera() {
  const cameraRef = useRef<CameraType | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const router = useRouter();

  const takePhoto = useCallback(() => {
    const base64Image = cameraRef.current?.takePhoto("base64url") as string;
    setImage(base64Image);
  }, [cameraRef]);

  const flip = useCallback(() => {
    cameraRef.current?.switchCamera();
  }, []);

  const onAccept = useCallback(() => {
    // save to server

    router.push("/photo/gallery");
  }, [router]);

  const onReject = useCallback(() => {
    setImage(null);
  }, []);

  const goBack = useCallback(() => {
    router.push("/photo/gallery");
  }, [router]);

  return {
    cameraRef,
    image,
    takePhoto,
    flip,
    onReject,
    onAccept,
    goBack,
  };
}
