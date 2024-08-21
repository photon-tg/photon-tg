import { Button } from '@/components/Button/Button';
import { Money } from '@/components/Money/Money';
import { RewardByDays, Task } from '@/interfaces/Task';

export interface TaskModalProps extends Task {

}

export function TaskModal(props: TaskModalProps) {
  const { name, rewards_by_day, description, image } = props;
  console.log(props, 'propshh')
  return (
    <div className={'flex flex-col'}>
      <img className={'w-[100px] mx-auto mb-[5px]'} src={image.url} />
      <span className={'text-xxl text-center mb-[10px]'}>{name}</span>
      <p className={'text-md font-normal text-center mb-[20px]'}>{description}</p>
      {rewards_by_day && <DailyRewardModal days={rewards_by_day} />}
    </div>
  );
}

interface DailyRewardModalProps {
  days: RewardByDays[];
}

function DailyRewardModal(props: DailyRewardModalProps) {
  const { days } = props;
  return (
    <div className={'flex flex-col gap-y-[10px]'}>
      <div style={{gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))'}} className={'grid overflow-y-scroll max-h-[250px] gap-[10px]'}>
        {days.map(({ day, reward }) => (
          <div key={day} className={`flex flex-col gap-y-[2px] px-[13px] py-[13px] overflow-hidden rounded ${'bg-light-blue'}`}>
            <span className={'text-md mb-[15px]'}>Day {day}</span>
            <Money isCompact amount={reward} size={'xs'} />
          </div>
        ))}
      </div>
      <Button variant={'filled'}>
        Claim
      </Button>
    </div>
  );
}
