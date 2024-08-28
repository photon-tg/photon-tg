'use client';

import Coin from '@/../public/assets/icons/photon.svg';
import { useApplicationContext } from '@/contexts/ApplicationContext/ApplicationContext';
import { useUserContext } from '@/contexts/UserContext';

export function Profile() {
  const { progress, passiveIncome, level } = useApplicationContext();
  const { user } = useUserContext();

  return (
    <div className={'mb-[5px] grid grid-cols-2 gap-x-[10px] pt-[5px]'}>
      <div className={'grid grid-cols-[max-content_1fr] gap-x-[10px]'}>
        <img
					height={63}
					width={63}
          src={user.telegram?.photo_url || '/assets/icons/test.png'}
          className={'rounded'}
          alt={'avatar'}
        />
        <div className={'grid content-start'}>
          <span className={'mb-[7px] text-md'}>{user?.telegram.first_name}</span>
          <span className={'text-md font-semibold text-sky-blue'}>
            Level {level}
          </span>
          <div className={'h-[9px] w-full rounded bg-[#2E3F69]'}>
            <div
              className={'h-full rounded bg-sky-blue'}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>
      <div className={'grid rounded bg-dark-blue px-[20px] py-[10px]'}>
        <span className={'text-md'}>Profit per hour</span>
        <div className={'flex gap-x-[5px] text-md'}>
          <Coin /> +{passiveIncome}
        </div>
      </div>
    </div>
  );
}
