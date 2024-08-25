import { userApi } from '@/api/user';
import { Button } from '@/components/Button/Button';
import { Money } from '@/components/Money/Money';
import { useUserContext } from '@/contexts/UserContext';
import { RewardByDays, Task } from '@/interfaces/Task';
import { cn } from '@/utils/cn';

export interface TaskModalProps extends Task {

}

export function TaskModal(props: TaskModalProps) {
  const { name, userTaskId, id, reward_by_day, daysCompleted, isRewardByDayClaimedToday, description, image } = props;
  console.log(props, 'propshh')
  return (
    <div className={'flex flex-col'}>
      <img className={'w-[100px] mx-auto mb-[5px]'} src={image.url} />
      <span className={'text-xxl text-center mb-[10px]'}>{name}</span>
      <p className={'text-md font-normal text-center mb-[20px]'}>{description}</p>
      {reward_by_day && <DailyRewardModal taskId={id} userTaskId={userTaskId} isRewardByDayClaimedToday={isRewardByDayClaimedToday} daysCompleted={daysCompleted as number} days={reward_by_day} />}
    </div>
  );
}

interface DailyRewardModalProps {
  days: RewardByDays[];
  daysCompleted: number;
  isRewardByDayClaimedToday?: boolean;
  userTaskId: string;
  taskId: string;
}

function DailyRewardModal(props: DailyRewardModalProps) {
  const { days, taskId, userTaskId, daysCompleted, isRewardByDayClaimedToday } = props;

  const { user } = useUserContext();

  const claimReward = () => {
    userApi.claimDailyReward(user?.id as string, taskId, userTaskId);
  };
  console.log(isRewardByDayClaimedToday, user)
  return (
    <div className={'flex flex-col gap-y-[10px]'}>
      <div style={{gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))'}} className={'grid overflow-y-scroll max-h-[250px] gap-[10px]'}>
        {days.map(({ day, reward }) => (
          <div key={day} className={cn(
            'flex flex-col gap-y-[2px] px-[13px] py-[13px] overflow-hidden rounded bg-light-blue',
            isRewardByDayClaimedToday && day > daysCompleted && 'bg-inactive-grey',
          )}>
            <span className={'text-md mb-[15px]'}>Day {day}</span>
            <Money isCompact amount={reward} size={'xs'} />
          </div>
        ))}
      </div>
      <Button disabled={isRewardByDayClaimedToday} onClick={claimReward} variant={'filled'}>
        Claim
      </Button>
    </div>
  );
}
