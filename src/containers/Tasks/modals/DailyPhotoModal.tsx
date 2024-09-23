import { UserTaskFragment } from '@/gql/graphql';
import { Money } from '@/components/Money/Money';
import { useSelector } from 'react-redux';
import {
	userCoinsSelector,
	userDailyPhotoIsCompleted,
} from '@/model/user/selectors';
import { getUserLevel } from '@/constants';
import { Task } from '@/model/application/types';
import { Button } from '@/components/Button/Button';
import { useRouter } from 'next/navigation';
import { useModalContext } from '@/contexts/ModalContext';
import Tick from '../../../../public/assets/icons/tick.svg';
import { cn } from '@/utils/cn';

interface DailyPhotoModalProps {
	task: Task;
	userTask?: UserTaskFragment;
}

export function DailyPhotoModal(props: DailyPhotoModalProps) {
	const { task, userTask } = props;

	const userCoins = useSelector(userCoinsSelector);
	const userLevel = getUserLevel(userCoins);
	const isDailyPhotoCompleted = useSelector(userDailyPhotoIsCompleted);
	const router = useRouter();
	const { closeModal } = useModalContext();

	const onClick = () => {
		const redirectTo = isDailyPhotoCompleted
			? '/photo/gallery'
			: '/photo/camera';
		router.push(redirectTo);
		closeModal();
	};

	return (
		<div className={'mb-[20px] flex flex-col justify-center gap-y-[50px]'}>
			<div className={'flex justify-center'}>
				<div className={'flex items-start gap-x-[20px]'}>
					<Money
						size={'lg'}
						amount={task.rewardByLevel?.[userLevel].coins!}
						isCompact
					/>
					<Money
						size={'lg'}
						amount={task.rewardByLevel?.[userLevel].passive!}
						perHour
					/>
				</div>
			</div>
			<Button onClick={onClick} variant={isDailyPhotoCompleted ? 'outline' : 'filled'}>
				<div
					className={
					cn(
						'flex justify-center',
						isDailyPhotoCompleted && 'grid grid-flow-col grid-cols-[min-content_1fr] items-center',
						)
					}
				>
					{isDailyPhotoCompleted && (<div
						className={
							'flex h-[40px] w-[40px] items-center justify-center rounded-[50%] bg-gradient-to-r from-text-blue to-[#00E1FF]'
						}
					>
						<Tick />
					</div>
					)}
					<span className={'self-center'}>
						{isDailyPhotoCompleted
							? 'Your photo is accepted'
							: 'Join challenge!'}
					</span>
				</div>
			</Button>
		</div>
	);
}
