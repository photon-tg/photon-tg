"use client";

import { Button } from "@/components/Button/Button";

export interface PhotoReviewProps {
  image: string;
  onReject(): void;
  onAccept(): void;
}

export function PhotoReview(props: PhotoReviewProps) {
  const { image, onAccept, onReject } = props;

  return (
    <div className={"grid grid-rows-[1fr_min-content]"}>
      <img className={"h-full w-full object-cover"} src={image} alt={""} />
      <div
        className={
          "absolute bottom-0 flex w-full justify-between px-[10px] pb-[10px]"
        }
      >
        <Button onClick={onReject}>Reject</Button>
        <Button onClick={onAccept}>Accept</Button>
      </div>
    </div>
  );
}
