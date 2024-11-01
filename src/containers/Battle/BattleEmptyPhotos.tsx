export function BattleEmptyPhotos() {
	return (
		<div
			className={
				'flex flex-col items-center justify-center rounded-[10px] bg-[#205295] px-[30px] py-[30px]'
			}
		>
			<img className={'mb-[30px]'} src={'/assets/icons/smile.svg'} />
			<p className={'mb-[10px] text-md font-semibold'}>
				You are a great judge!
			</p>
			<p className={'mb-[20px] text-md'}>
				There are yet no photos to choose from
			</p>
		</div>
	);
}
