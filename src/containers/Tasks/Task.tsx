import { Money } from '@/components/Money/Money';
import Tick from '@/../public/assets/icons/tick.svg';
import { Task as TaskType } from '@/interfaces/Task';
import { useModalContext } from '@/contexts/ModalContext';
import { TaskModal } from './TaskModal';

interface TaskProps extends TaskType {}

export function Task(props: TaskProps) {
  const { name, image, isCompleted, reward_coins } = props;

  const isClickable = true;

  const { openModal } = useModalContext();

  const onClick = () => {
    openModal(<TaskModal {...props} />);
  };

  return (
    <article
      onClick={onClick}
      className={`grid w-full grid-cols-[max-content_1fr_max-content] gap-x-[10px] rounded bg-light-blue px-[12px] py-[10px] ${isClickable && 'active:bg-[#183368]'}`}
    >
      <div>
        <img src={image.url} />
      </div>
      <div className={'grid gap-y-[5px]'}>
        <span className={'text-lg font-medium'}>{name}</span>
        <div className={'flex items-center gap-x-[10px]'}>
          <Money size={'md'} amount={reward_coins || 0} />
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
