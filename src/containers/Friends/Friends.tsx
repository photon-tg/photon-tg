'use client';

import { Button } from "@/components/Button/Button";
import { CTACard } from "@/components/CTACard/CTACard";
import { appURL } from "@/constants/urls";

export function Friends() {

  const onReferealLink = () => {
    navigator.clipboard.writeText(appURL);
  }

  const onShare = async () => {
    const shareData = {
      title: 'Photon',
      text: 'Join Photon!',
      url: appURL,
    };

    const canShare = navigator.canShare(shareData);

    if (canShare) {
      const shareResult = navigator.share(shareData);
      console.log(shareResult)
    }
  }

  return (
    <div className={'flex items-center flex-col px-[15px] py-[50px] h-full relative'}>
      <h1 className={'text-xxl mb-[10px]'}>Invite friends!</h1>
      <p className={'text-sm text-text-blue text-center mb-[20px] max-w-[230px]'}>you and your friend will receive bonuses for participation</p>
      <div className={'flex flex-col gap-y-[10px] mb-[20px] w-full'}>
        <CTACard title={'Invite a friend'} description={'for you and your friend'} profit={5000} iconUrl={'/assets/present.png'} />
        <CTACard title={'Invite a friend'} description={'for you and your friend'} profit={5000} iconUrl={'/assets/present.png'} />
      </div>
      <div className={'w-full grid gap-y-[10px] absolute bottom-0 left-0 px-[15px] pb-[20px]'}>
        <Button onClick={onReferealLink} variant={'outline'}>Referal link</Button>
        <Button onClick={onShare} variant={'filled'}>Invite a friend</Button>
      </div>
    </div>
  );
}
