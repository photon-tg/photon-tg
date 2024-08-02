import { MouseEventHandler, PropsWithChildren } from "react";

export interface ButtonProps {
  variant?: "outline" | "filled";
  width?: string | number;
  size?: "lg";

  onClick?: MouseEventHandler<HTMLButtonElement>;
}

export function Button(props: PropsWithChildren<ButtonProps>) {
  const {
    children,
    variant = "outline",
    width = "fit-content",
    size = "md",
    onClick,
  } = props;

  return (
    <div
      className={`rounded bg-gradient-to-tr from-light-blue from-0% to-sky-blue to-100% p-[4px] w-[${width}]`}
    >
      <button
        onClick={onClick}
        className={`w-full rounded bg-dark-blue px-[30px] py-[15px] text-center text-md font-semibold`}
      >
        {children}
      </button>
    </div>
  );
}
