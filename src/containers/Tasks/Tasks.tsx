import { TasksList } from './TasksList';

export function Tasks() {
  return (
    <div className={'grid pt-[25px] px-[15px] pb-[20px] overflow-auto'}>
      <img className={'justify-self-center mb-[10px]'} src={'/assets/task.png'} />
      <h1 className={'text-xxl justify-self-center mb-[50px]'}>Tasks</h1>
      <div className={'flex flex-col gap-y-[40px] '}>
        <TasksList />
      </div>
    </div>
  );
}

