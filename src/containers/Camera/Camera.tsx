'use client';

import { Camera as CameraPro, CameraProps } from 'react-camera-pro';
import { useCamera } from '@/containers/Camera/useCamera';
import CameraSwitch from '@/../public/assets/icons/cameraswitch.svg';
import ArrowIcon from '@/../public/assets/icons/Photo/arrow-left.svg';
import { PhotoReview } from '@/containers/Camera/PhotoReview/PhotoReview';

const errorMessages: CameraProps['errorMessages'] = {
  noCameraAccessible: 'No camera accessible',
  permissionDenied: 'Permission denied',
  switchCamera: 'Switch camera',
  canvas: 'Problem occurred',
};

export function Camera() {
  const { cameraRef, takePhoto, flip, image, onReject, onAccept, goBack } =
    useCamera();

  if (image) {
    return (
      <PhotoReview onReject={onReject} onAccept={onAccept} image={image} />
    );
  }

  return (
    <div>
      <button
        onClick={goBack}
        className={'absolute left-[20px] top-[20px] z-10'}
      >
        <ArrowIcon />
      </button>
      <CameraPro
        facingMode={'user'}
        ref={cameraRef}
        errorMessages={errorMessages}
      />
      <div
        className={
          'absolute bottom-0 left-[50%] grid w-full max-w-[375px] translate-x-[-50%] grid-cols-3 justify-items-center pb-[30px]'
        }
      >
        <button />
        <button
          onClick={takePhoto}
          className={'h-[50px] w-[50px] self-center rounded-[50%] border-[5px]'}
        />
        <button onClick={flip}>
          <CameraSwitch />
        </button>
      </div>
    </div>
  );
}
