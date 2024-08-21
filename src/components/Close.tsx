interface CloseProps {
  onClick(): void;
}

export function Close(props: CloseProps) {
  const { onClick } = props;

  return (
    <button onClick={onClick} className={'relative w-[35px] h-[35px] rounded-[50%] bg-[#0A1225]'}>
      <div className={'bg-[#24428B] absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[18px] h-[2px] rounded -rotate-45'}></div>
      <div className={'bg-[#24428B] absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[18px] h-[2px] rounded rotate-45'}></div>
    </button>
  );
}
