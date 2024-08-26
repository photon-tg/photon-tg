import { TasksList } from './TasksList';

export function Tasks() {
  return (
    <div className={'grid overflow-auto px-[15px] pb-[20px] pt-[25px]'}>
      <img
        className={'mb-[10px] justify-self-center'}
        src={'/assets/task.png'}
      />
      <h1 className={'mb-[50px] justify-self-center text-xxl'}>Tasks</h1>
      <div className={'flex flex-col gap-y-[40px]'}>
        <TasksList />
      </div>
    </div>
  );
}
