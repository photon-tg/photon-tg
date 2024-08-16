import Coin from "@/../public/assets/icons/photon.svg";
import { Button } from "@/components/Button/Button";

export function EmptyMessage() {
  return (
    <div className={"flex flex-col rounded bg-light-blue px-[30px] py-[24px]"}>
      <h2 className={"mb-[15px] text-center text-xl"}>Your gallery is empty</h2>
      <div className={"mb-[30px] flex flex-col gap-y-[2px] text-lg"}>
        Make your first photo and earn
        <Money />
      </div>
      <Button width={"100%"}>Some text</Button>
    </div>
  );
}

function Money() {
  return (
    <div
      className={"flex items-center gap-x-[5px] font-semibold text-sky-blue"}
    >
      <Coin />
      +5000
    </div>
  );
}
