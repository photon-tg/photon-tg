'use client';

import { useState } from 'react';
import { levelToMaxEnergy } from '@/constants';
import { useApplicationContext } from '@/contexts/ApplicationContext/ApplicationContext';

export function Tap() {
  const { coins, energy, tap } = useApplicationContext();

  return (
    <div className={'flex h-full items-center justify-center'}>
      <div
        className={
          'grid-rows-[repeat(3, min-content)] grid items-center justify-center gap-y-[15px]'
        }
      >
        <span
          className={
            'flex items-center gap-x-[10px] justify-self-center text-xxl'
          }
        >
          <img width={40} height={40} src={'/assets/icons/photon.svg'} />
          {coins}
        </span>
        <TapArea onTap={tap} />
        <div className={'flex items-center justify-center gap-x-[10px]'}>
          <img className={'w-[10px]'} src={'/assets/icons/energy.svg'} />
          {energy} / {levelToMaxEnergy.get(1)}
        </div>
      </div>
    </div>
  );
}

export interface TapAreaProps {
  onTap(): void;
}

function TapArea(props: TapAreaProps) {
  const { onTap } = props;

  const [isPressed, setIsPressed] = useState(false);

  const onTouchStart = () => {
    setIsPressed(true);
  };

  const onTouchEnd = () => {
    setIsPressed(false);
    onTap();
  };

  return (
    <button
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      className={
        'aspect-square w-[300px] rounded-[50%] bg-gradient-to-b from-sky-blue from-0% via-saturated-blue via-50% to-deep-blue to-100% px-[12px] py-[12px]'
      }
    >
      <div
        className={`flex h-full w-full items-center justify-center rounded-[50%] ${isPressed ? 'bg-deep-blue' : 'bg-dark-blue'}`}
      >
        <img className={'w-[80%]'} src={'/assets/camera-big.png'} />
      </div>
    </button>
  );
}