import { useContent } from '@/containers/Battle/useContent';

export function BattleEmptyPhotos() {
	const content = useContent();
	return (
		<div
			className={
				'flex flex-col items-center justify-center rounded-[10px] bg-[#205295] px-[30px] py-[30px]'
			}
		>
			<img className={'mb-[30px]'} src={'/assets/icons/smile.svg'} />
			<p className={'mb-[10px] text-md font-semibold'}>
				{content.youAreAGreatJudge}
			</p>
			<p className={'mb-[20px] text-md'}>{content.thereAreNoPhotos}</p>
		</div>
	);
}
