import { Money } from '../Money/Money';

interface CTACardProps {
 iconUrl?: string;
 title: string;
 profit: number;
 description?: string;
 clickable?: boolean;
}

export function CTACard(props: CTACardProps) {
  const { iconUrl, title, profit, description, clickable = false } = props;

  return (
    <article className={`grid grid-cols-[max-content_1fr] bg-light-blue py-[10px] px-[12px] gap-x-[10px] w-full rounded ${clickable && 'active:bg-[#183368]'}`}>
      <div>
        <img src={iconUrl} />
      </div>
      <div className={'gap-y-[5px] grid'}>
        <span className={'text-lg font-medium'}>{title}</span>
        <div className={'flex gap-x-[10px] items-center'}><Money size={'md'} amount={profit} />{description && <p className={'text-sm text-[#939393]'}>{description}</p>}</div>
      </div>
    </article>
  )
}
