

import { Money } from '@/components/Money/Money';
import Tick from '@/../public/assets/icons/tick.svg';
import { Task as TaskType } from '@/interfaces/Task';
import { useModalContext } from '@/contexts/ModalContext';
import { TaskModal } from './TaskModal';

interface TaskProps extends TaskType {
}

export function Task(props: TaskProps) {
  const { name, image, isCompleted, reward_coins } = props;

  const isClickable = true;

  const { openModal } = useModalContext();

  const onClick = () => {
    openModal(<TaskModal {...props} />);
  }

  return (
    <article onClick={onClick} className={`grid grid-cols-[max-content_1fr_max-content] bg-light-blue py-[10px] px-[12px] gap-x-[10px] w-full rounded ${isClickable && 'active:bg-[#183368]'}`}>
      <div>
        <img src={image.url} />
      </div>
      <div className={'gap-y-[5px] grid'}>
        <span className={'text-lg font-medium'}>{name}</span>
        <div className={'flex gap-x-[10px] items-center'}><Money size={'md'} amount={reward_coins || 0} /></div>
      </div>
      {isCompleted && (
        <div className={'w-[45px] h-[45px] bg-gradient-to-r from-text-blue to-[#00E1FF] rounded-[50%] flex items-center justify-center'}>
          <Tick />
        </div>
      )}
    </article>
  );
}
