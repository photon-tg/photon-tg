import { Money } from '@/components/Money/Money';
import Tick from '@/../public/assets/icons/tick.svg';
import { useModalContext } from '@/contexts/ModalContext';
import { TaskModal } from './TaskModal';
import { PersonalizedTask, RewardByDay, TaskType } from '@/interfaces/Task';

interface TaskProps extends PersonalizedTask {}

export function Task(props: TaskProps) {
  const { name, images, id,  isCompleted, rewardByDay, reward_coins, type,  } = props;

  const isClickable = true;

  const { openModal } = useModalContext();

  const onClick = () => {
    openModal(<TaskModal taskId={id} />);
  };

  return (
    <article
      onClick={onClick}
      className={`grid w-full grid-cols-[max-content_1fr_max-content] gap-x-[10px] rounded bg-light-blue px-[12px] py-[10px] ${isClickable && 'active:bg-[#183368]'}`}
    >
      <div>
        <img src={images?.url || ''} />
      </div>
      <div className={'grid gap-y-[5px]'}>
        <span className={'text-lg font-medium'}>{name}</span>
        <div className={'flex items-center gap-x-[10px]'}>
          <Money size={'md'} amount={getTaskRewardAmount(type, rewardByDay, reward_coins)} />
        </div>
      </div>
      {isCompleted && (
        <div
          className={
            'flex h-[45px] w-[45px] items-center justify-center rounded-[50%] bg-gradient-to-r from-text-blue to-[#00E1FF]'
          }
        >
          <Tick />
        </div>
      )}
    </article>
  );
}

function getTaskRewardAmount(taskType: string, rewardByDay: RewardByDay[] | undefined, rewardCoins: number | null | undefined): number {
	switch (taskType as TaskType) {
		case 'daily_reward': {
			return rewardByDay?.slice(-1)[0].reward as number;
		}
		default:
			return rewardCoins as number;
	}
}
