import { MouseEventHandler, PropsWithChildren } from 'react';

export interface ButtonProps {
  variant?: 'outline' | 'filled';
  width?: string | number;
  size?: 'lg';

  onClick?: MouseEventHandler<HTMLButtonElement>;
}

export function Button(props: PropsWithChildren<ButtonProps>) {
  const {
    children,
    variant = 'outline',
    width = 'fit-content',
    size = 'md',
    onClick,
  } = props;

  return (
    <div
      className={`rounded ${variant === 'outline' ? 'bg-gradient-to-tr from-light-blue from-0% to-sky-blue to-100%' : 'bg-gradient-to-tr from-sky-blue to-saturated-blue'} p-[4px] w-[${width}] `}
    >
      <button
        onClick={onClick}
        className={`w-full rounded ${variant === 'outline' ? 'bg-dark-blue active:bg-gradient-to-tr active:from-light-blue active:from-0% active:to-sky-blue active:to-100% ' : 'bg-gradient-to-tr from-sky-blue to-saturated-blue'} px-[30px] py-[15px] text-center text-lg font-semibold`}
      >
        {children}
      </button>
    </div>
  );
}
